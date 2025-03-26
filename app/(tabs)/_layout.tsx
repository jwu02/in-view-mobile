import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from "expo-router";
import { Button } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'black',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Questions",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="question-circle" color={color} />,
          headerRight: () => (
            <Button title="New" onPress={() => {
              router.push('/add-question-modal');
            }} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  )
}