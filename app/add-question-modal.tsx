import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { questionsTable } from '@/db/schema/questions';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as styles from '@/constants/styles';

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

const expo = SQLite.openDatabaseSync(
  'db.db',
  { enableChangeListener: true }
);
const db = drizzle(expo);

const AddQuestionModal = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
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
    await db.insert(questionsTable).values([
      {
        title: data.questionTitle,
        notes: data.notes,
      },
    ]);

    Toast.show({
      text1: data.questionTitle,
      type: 'success'
    })

    router.back();
  };

  return (
    <ScrollView contentContainerClassName={styles.section}>
      {/* Question Title Field */}
      <View className={styles.inputGroup}>
        <Text className={styles.groupTitle}>Question Title</Text>
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

      <TouchableOpacity className={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text className={styles.buttonText}>Add Question</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddQuestionModal