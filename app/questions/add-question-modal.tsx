import { View, Text, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { questionsTable } from '@/db/schema/questions';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { Stack, useRouter } from 'expo-router';
import * as styles from '@/constants/styles';
import { Toast } from "toastify-react-native";

const QUESTION_MAX_LENGTH = 200;
const NOTES_MAX_LENGTH = 2000;

// Define the schema with zod
const formSchema = z.object({
  questionTitle: z
    .string()
    .min(1, 'Question Title is required')
    .max(QUESTION_MAX_LENGTH, `Question Title must be ${QUESTION_MAX_LENGTH} characters or less`),
  notes: z
    .string()
    .max(NOTES_MAX_LENGTH, `Notes must be ${NOTES_MAX_LENGTH} characters or less`)
    .optional(),
});

// TypeScript type for the form data
type FormData = z.infer<typeof formSchema>;

const AddQuestionModal = () => {
  const db = SQLite.useSQLiteContext();
  const drizzleDb = drizzle(db);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionTitle: '',
      notes: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    // Handle form submission here
    await drizzleDb.insert(questionsTable).values([
      {
        title: data.questionTitle,
        notes: data.notes,
      },
    ]);

    reset();

    Toast.success('Question added successfully!');
    
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerTitle: 'Add Question',
          headerLeft: () => (
            <Button title="Cancel" onPress={() => router.back()} />
          ),
          headerRight: () => (
            <Button title="Add" onPress={handleSubmit(onSubmit)} />
          ),
        }} 
      />
      
      <ScrollView contentContainerClassName={styles.section}>
        {/* Question Title Field */}
        <View className={styles.inputGroup}>
          <Text className={styles.groupTitle}>Question</Text>
          <Controller
            control={control}
            name="questionTitle"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter question title"
                  multiline
                  // maxLength={QUESTION_MAX_LENGTH}
                  className={styles.inputField}
                />
                <Text className={`${styles.remainingCharacters} 
                  ${value.length >= QUESTION_MAX_LENGTH - 20 && styles.approachingCharacterLimit}`}>
                  {QUESTION_MAX_LENGTH - value.length}
                </Text>
              </>
            )}
          />
        </View>

        {/* Notes Field */}
        <View className={styles.inputGroup}>
          <Text className={styles.groupTitle}>Notes</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="(Optional)"
                  multiline
                  // numberOfLines={4}
                  // maxLength={NOTES_MAX_LENGTH}
                  className={styles.inputField}
                />
                <Text className={`${styles.remainingCharacters} 
                  ${value && value.length >= NOTES_MAX_LENGTH - 20 && styles.approachingCharacterLimit}`}>
                  {value ? NOTES_MAX_LENGTH - value.length : NOTES_MAX_LENGTH}
                </Text>
              </>
            )}
          />
          {/* {errors.notes && (
            <Text className={errorStyles}>{errors.notes.message}</Text>
          )} */}
        </View>
      </ScrollView>
    </>
  )
}

export default AddQuestionModal