import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as styles from "@/constants/styles";

interface AudioResponseProps {
  audioUri: string | null;
  setAudioUri: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function AudioResponse({ audioUri, setAudioUri }: AudioResponseProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null); // For playback
  const [isPlaying, setIsPlaying] = useState(false); // Playback state
  const [error, setError] = useState<string | null>(null);

  // Request audio recording permissions
  async function requestPermissions() {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access microphone was denied");
      return false;
    }
    return true;
  }

  // Start recording
  async function startRecording() {
    try {
      // If there's a previous recording, delete it
      if (audioUri) {
        await FileSystem.deleteAsync(audioUri, { idempotent: true });
        console.log(`Deleted previous recording: ${audioUri}`);
        setAudioUri(null);
      }

      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create a new recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setError(null);
    } catch (err) {
      setError("Failed to start recording");
      console.error(err);
    }
  }

  // Stop recording and prepare for playback
  async function stopRecording() {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Store the new recording URI
      setAudioUri(uri);
      setError(null);
    } catch (err) {
      setError("Failed to stop recording or load sound");
      console.error(err);
    }
  }

  // Play or pause the recorded audio, with replay support
  async function togglePlayback() {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // If the audio has finished, rewind to the start before playing
        if (status.isLoaded && status.positionMillis >= status.durationMillis!) {
          await sound.setPositionAsync(0); // Rewind to beginning
        }
        await sound.playAsync();
        setIsPlaying(true);

        // Update state when playback finishes
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            sound.setPositionAsync(0); // Auto-rewind after finishing
          }
        });
      }
    } catch (err) {
      setError("Failed to toggle playback");
      console.error(err);
    }
  }

  useEffect(() => {
    if (audioUri) {
      (async () => {
        if (sound) {
          // Unload the previous sound from memory if it exists
          await sound.unloadAsync();
        }

        // Load the recorded audio for playback
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri }, // Non-null assertion since uri is guaranteed here
          { shouldPlay: false }
        );
        setSound(newSound);
      })();
    }
    setIsPlaying(false);
  }, [audioUri]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      } 
    };
  }, [sound]);

  return (
    <View className={styles.section}>
      <Text>{audioUri ? `Audio recorded: ${audioUri}` : "No audio recorded"}</Text>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />

      {sound && !recording && (
        <Button
          title={isPlaying ? "Pause Playback" : "Play Recording"}
          onPress={togglePlayback}
        />
      )}
    </View>
  );
}