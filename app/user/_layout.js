import { Tabs } from 'expo-router';
import { I18nManager, Platform } from 'react-native';
import { useEffect } from 'react';
import { ActivitiesProvider } from '../../context/ActivitiesContext';
import { Home, User, Dumbbell, Award ,ShoppingCart} from 'lucide-react-native';
import { UserProvider } from '../../context/UserContext';

function TabLayout() {

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    if (Platform.OS === 'android') {
      // Need to reload app for changes to fully apply
      // Expo doesn't support live forceRTL, but at least sets layout direction
    }
  }, []);

  const screens = [
        { name: 'profile', icon: User, label: "פרופיל" },
        { name: 'store', icon: ShoppingCart, label: "חנות" },
        { name: 'competitions', icon: Award, label: "תחרות" },
        { name: 'chatGpt', icon: Dumbbell, label: "GPT" },
        { name: 'index', icon: Home, label: "בית" },
      ]
  return (
    
    <Tabs
      screenOptions={{ 
        tabBarActiveTintColor: '#4CC9F0',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingBottom: 4, height: 60 },
        headerTitleAlign: 'center',
      }}
    >
      {screens.map(({ name, icon: Icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarLabel: label,
            tabBarIcon: ({ color, size }) => <Icon color={color} size={size} />,
          }}
        />
      ))}
      <Tabs.Screen
        name="ExerciseCamera"
        options={{
          href: null, // Don't show in the bottom tab bar
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      />
    </Tabs>
    
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <ActivitiesProvider> 
        <TabLayout />
      </ActivitiesProvider>
    </UserProvider>
  );
}
