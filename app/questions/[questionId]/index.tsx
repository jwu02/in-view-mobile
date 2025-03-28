import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as styles from '@/constants/styles'
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { questionsTable } from '@/db/schema/questions';
import { eq } from 'drizzle-orm';
import { responsesTable } from '@/db/schema/responses';
import Ionicons from '@expo/vector-icons/Ionicons';

const QuestionDetails = () => {
  const { questionId } = useLocalSearchParams();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const { data } = useLiveQuery(drizzleDb
    .select({
      question: questionsTable.title,
      questionNotes: questionsTable.notes,
      questionCreatedAt: questionsTable.createdAt,
      responseId: responsesTable.id,
      responseType: responsesTable.type,
      textContent: responsesTable.textContent,
      audioPath: responsesTable.audioPath,
      responseCreatedAt: responsesTable.createdAt,
    })
    .from(questionsTable)
    .leftJoin(responsesTable, eq(questionsTable.id, responsesTable.questionId))
    .where(eq(questionsTable.id, Number(questionId)))
  );

  const question = useMemo(() => {
    if (data.length === 0) return null;

    // Structure the data: question once, responses as an array
    return {
      title: data[0].question,
      notes: data[0].questionNotes,
      createdAt: data[0].questionCreatedAt,
      responses: data
        .map((row) => ({
          id: row.responseId,
          type: row.responseType,
          textContent: row.textContent,
          audioPath: row.audioPath,
          createdAt: row.responseCreatedAt,
        }))
    };
  }, [data]);
  console.log(question);

  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{
        title: `Details`,
        headerBackTitle: 'Questions',
      }} />

      <ScrollView contentContainerClassName={styles.section}>
        <View className={styles.inputGroup}>
          <Text className={styles.groupTitle}>Question</Text>
          <Text className={styles.subsection}>{question?.title}</Text>
        </View>
        
        <View className={styles.inputGroup}>
          <Text className={styles.groupTitle}>Notes</Text>
          <Text className={styles.subsection}>{question?.notes}</Text>
        </View>
        
        <View className={styles.inputGroup}>
          <Text className={styles.groupTitle}>Responses</Text>
          <View className={styles.subsection}>
            <TouchableOpacity className="flex-row items-center justify-center gap-1 mb-4 mx-auto" 
              onPress={() => {
                // Navigate to the add response screen
                router.push({
                  pathname: '/questions/[questionId]/responses/add-response',
                  params: { questionId: questionId.toString() }
                });
              }}>
              <Ionicons name="add-circle" size={20} />
              <Text>Add a response</Text>
            </TouchableOpacity>
            {question && question?.responses.length === 0 ?
              question?.responses.map((response) => (
                <View key={response.id}>
                  <Text>{response.textContent}</Text>
                </View>
              ))
              :
              <Text className="mx-auto">No responses recorded.</Text>
            }
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default QuestionDetails