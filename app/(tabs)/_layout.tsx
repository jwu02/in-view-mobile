import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useRouter } from "expo-router";
import { Button, TouchableOpacity } from 'react-native';

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
            <Button title="Add" onPress={() => {
              router.push('/add-question-modal');
            }} />
            // <TouchableOpacity onPress={() => {
            //   router.push('/add-question-modal');
            // }}>
            //   <FontAwesome size={24} name="plus" color="black" />
            // </TouchableOpacity>
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