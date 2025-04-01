import { Slot } from 'expo-router';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider, useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function Redirector() {
  const { user } = useUser();

  // 👇 Comment this out for now to allow manual role selection from /index.js
  // useEffect(() => {
  //   if (!user) {
  //     router.replace('/login');
  //   } else if (user.type === 'user') {
  //     router.replace('/user');
  //   } else if (user.type === 'handler') {
  //     router.replace('/handler/dashboard');
  //   }
  // }, [user]);

  if (!user) {
    // Optional: show a spinner or let index.js handle role selection
    return null;
  }

  return null;
}

export default function RootLayout() {
  return (
    <UserProvider>
      <LanguageProvider>
        <Slot />
        <Redirector />
      </LanguageProvider>
    </UserProvider>
  );
}