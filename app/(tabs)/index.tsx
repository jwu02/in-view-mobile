import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { FlatList, ScrollView, Text, View } from "react-native";
import * as schema from '@/db/schema/questions';
import * as styles from '@/constants/styles';

const expo = openDatabaseSync(
  'db.db', 
  { enableChangeListener: true }
);

const db = drizzle(expo);

export default function Index() {
  // Re-renders automatically when data changes
  const { data } = useLiveQuery(db.select().from(schema.questionsTable));

  return (
    <ScrollView className={styles.section}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className={styles.subsection}>
            <Text>{item.title}</Text>
          </View>
        )}
        scrollEnabled={false}
        contentContainerClassName="gap-2"
      />
    </ScrollView>
  );
}
