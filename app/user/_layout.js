import { Tabs } from 'expo-router';
import { I18nManager, Platform } from 'react-native';
import { useEffect } from 'react';
import { ActivitiesProvider } from '../../context/ActivitiesContext';
import { Home, User, Info, Trophy ,ShoppingCart} from 'lucide-react-native';
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
        { name: 'competitions', icon: Trophy, label: "תחרות" },
        { name: 'chatGpt', icon: Info, label: "עזרא Ai" },
        { name: 'index', icon: Home, label: "בית" },
      ]
  return (
    
    <Tabs
      screenOptions={{ 
        tabBarActiveTintColor: '#4CC9F0',
        tabBarStyle: { paddingBottom: 4, height: 60 },
        tabBarShowLabel: false,
        tabBarIconStyle: { justifyContent: 'center', alignItems: 'center', marginTop: 6 }, // 👈 This helps with centering
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
      <Tabs.Screen
        name="resourceLinks"
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
