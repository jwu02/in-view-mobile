import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as schema from '@/db/schema/questions';
import * as styles from '@/constants/styles';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from "expo-router";

export default function Index() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  // Re-renders automatically when data changes
  const { data } = useLiveQuery(drizzleDb.select().from(schema.questionsTable));
  const router = useRouter();

  return (
    <ScrollView className={styles.section}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity className={`${styles.subsection} flex-row justify-between items-center`}
            onPress={() => router.push({
              pathname: '/questions/[id]',
              params: { id: item.id }
            })}>
            <Text>{item.title}</Text>
            <Entypo name="chevron-small-right" size={24} />
          </TouchableOpacity>
        )}
        scrollEnabled={false}
        contentContainerClassName="gap-2"
      />
    </ScrollView>
  );
}
