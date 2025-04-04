import { Tabs } from 'expo-router';
import { I18nManager, Platform, View, Image } from 'react-native';
import { useEffect } from 'react';
import { ActivitiesProvider } from '../context/ActivitiesContext';
import { Home, User, Info, Trophy, ShoppingCart } from 'lucide-react-native';
import { UserProvider } from '../context/UserContext';

function TabLayout() {
  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  const screens = [
    { name: 'profile', icon: User, label: 'פרופיל' },
    { name: 'store', icon: ShoppingCart, label: 'חנות' },
    { name: 'competitions', icon: Trophy, label: 'תחרות' },
    { name: 'chatGpt', icon: Info, label: 'עזרא Ai' },
    { name: 'index', icon: Home, label: 'בית' },
  ];

  return (
    <Tabs
    screenOptions={{
      headerStyle: {
        height: 40, // 👈 This is the line that controls the header height
      },
      tabBarActiveTintColor: '#4CC9F0',
      tabBarInactiveTintColor: '#999',
      tabBarLabelStyle: {
        fontSize: 13,
        fontWeight: 'bold',
      },
      tabBarStyle: {
        paddingBottom: 6,
        height: 60,
        backgroundColor: '#fff',
      },
      headerTitleAlign: 'right',
      headerTitleStyle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#4CC9F0',
        fontFamily: 'System', // Replace with custom font if needed
        letterSpacing: 1,
      },
      // ✅ Place icon on left for RTL by using headerRight
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <Image
            source={require('../assets/images/icon.png')} // replace with your own image path
            style={{
              width: 140,
              height: 60,
            }}
          />
        </View>
      ),
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
          href: null,
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="resourceLinks"
        options={{
          href: null,
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
