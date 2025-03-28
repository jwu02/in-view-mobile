import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, ScrollView, Button, useWindowDimensions } from 'react-native'
import { useEffect, useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import * as styles from '@/constants/styles'
import TextResponse from './TextResponse';
import AudioResponse from './AudioResponse';
import VideoResponse from './VideoResponse';
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as FileSystem from "expo-file-system";

export const RESPONSE_MAX_LENGTH = 200;

const responseFormSchema = z
  .object({
    text: z
      .string()
      .max(RESPONSE_MAX_LENGTH, `Response must be ${RESPONSE_MAX_LENGTH} characters or less`)
      .optional(),
    audioPath: z.string().optional(),
    videoPath: z.string().optional(),
  })
  // .partial()
  // Ensure at least one of the response types is provided
  .refine((data) => data.text || data.audioPath || data.videoPath, {
    message: 'Either a text, audio or video response should be provided.',
    path: ["text", "audioPath", "videoPath"],
  })

type ResponseFormData = z.infer<typeof responseFormSchema>;

type ResponseType = 'text' | 'audio' | 'video';

const AddResponse = () => {
  const { questionId } = useLocalSearchParams();

  const router = useRouter();
  
  const [selectedResponse, setSelectedresponse] = useState<ResponseType>("text");
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isAudioSaved, setIsAudioSaved] = useState(false);

  useEffect(() => {
    // Update the form value when audioUri changes
    setValue('audioPath', audioUri || '');

    // return () => {
    //   // Delete the last recording if not submitted
    //   if (audioUri && !isAudioSaved) {
    //     FileSystem.deleteAsync(audioUri, { idempotent: true })
    //       .then(() => console.log(`Cleaned up: ${audioUri}`))
    //       .catch((err) => console.error("Cleanup failed:", err));
    //   }
    // };
  }, [audioUri]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      text: '',
      audioPath: '',
      videoPath: '',
    },
  });

  const onSubmit = (data: ResponseFormData) => {
    // console.log('Form submitted:', data);
    if (selectedResponse === 'text') {
      responseFormSchema.parse({ text: data.text });
      console.log('Text response:', data.text);
    } else if (selectedResponse === 'audio') {
      responseFormSchema.parse({ audioPath: data.audioPath});
      setIsAudioSaved(true); // Only if audioPath valid
      console.log('Audio response:', data.audioPath);
    } else if (selectedResponse === 'video') {
      responseFormSchema.parse({ videoPath: data.videoPath});
      console.log('Video response:', data.videoPath);
    } else {
      console.log('Invalid response type: ', selectedResponse);
    }

    // Form submission cleanup
    reset();
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Add Response',
          headerBackTitle: 'Details',
          headerRight: () => (
            <Button title="Add" onPress={handleSubmit(onSubmit)} />
          ),
        }} 
      />

      <ScrollView className={styles.section}>
        <View>
          <Text className={styles.groupTitle}>Choose response type</Text>
          <Picker
            selectedValue={selectedResponse}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedresponse(itemValue)
            }>
            <Picker.Item label="Text" value="text" />
            <Picker.Item label="Audio" value="audio" />
            <Picker.Item label="Video" value="video" />
          </Picker>
        </View>
        
        <View className={styles.inputGroup}>
          <Text className={styles.groupTitle}>Enter response here</Text>
          <View className={`${styles.subsection} !p-0`}>
            {selectedResponse === 'text' ? (
              <TextResponse control={control} />
            ) : selectedResponse === 'audio' ? (
              <AudioResponse audioUri={audioUri} setAudioUri={setAudioUri} />
            ) : (
              <VideoResponse />
            )}
          </View>
        </View>

        {/* errors */}
        <View>
          <Text>gello</Text>
          {errors.text && <Text style={{ color: 'red' }}>{errors.text.message}</Text>}
          {errors.audioPath && <Text style={{ color: 'red' }}>{errors.audioPath.message}</Text>}
          {errors.videoPath && <Text style={{ color: 'red' }}>{errors.videoPath.message}</Text>}
        </View>
      </ScrollView>
    </>
  )
}

export default AddResponse