import { Tabs } from 'expo-router';
import { I18nManager, Platform } from 'react-native';
import { useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';
import { ActivitiesProvider } from '../../context/ActivitiesContext';
import { Home, User, Dumbbell, Award } from 'lucide-react-native';
import LanguageToggle from '../../components/LanguageToggle';
import { UserProvider } from '../../context/UserContext';

function TabLayout() {
  const { language, translations } = useLanguage();
  const t = translations[language];

  const isRTL = language === 'he';

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(isRTL);

    if (Platform.OS === 'android') {
      // Need to reload app for changes to fully apply
      // Expo doesn't support live forceRTL, but at least sets layout direction
    }
  }, [language]);

  const screens = isRTL
    ? [
        { name: 'profile', icon: User, label: t.profile },
        { name: 'achievements', icon: Award, label: t.achievements },
        { name: 'activities', icon: Dumbbell, label: t.activities },
        { name: 'index', icon: Home, label: t.home },
      ]
    : [
        { name: 'index', icon: Home, label: t.home },
        { name: 'activities', icon: Dumbbell, label: t.activities },
        { name: 'achievements', icon: Award, label: t.achievements },
        { name: 'profile', icon: User, label: t.profile },
      ];

  return (
    
    <Tabs
      screenOptions={{ 
        tabBarActiveTintColor: '#4CC9F0',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { paddingBottom: 4, height: 60 },
        headerTitleAlign: 'center',
        headerRight: () => <LanguageToggle />,
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
      <LanguageProvider>
        <ActivitiesProvider> 
          <TabLayout />
        </ActivitiesProvider>
      </LanguageProvider>
    </UserProvider>
  );
}
