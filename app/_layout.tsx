import { Stack } from "expo-router";
import "./global.css";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { ActivityIndicator, Text, View } from 'react-native';
import { Suspense, useEffect, useState } from 'react';
import { questionsTable } from '@/db/schema/questions';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import ToastManager from "toastify-react-native";

export const DATABASE_NAME = 'db.db';

const expoDb = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName="db.db"
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <Stack>
          <ToastManager />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="questions/add-question-modal" 
            options={{ 
              title: 'Add Question',
              presentation: 'modal',
              // headerShown: false,
            }} 
          />
          <Stack.Screen
            name="questions/[id]/responses/add-response"
            options={{
              title: 'Add Response',
            }}
          />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
