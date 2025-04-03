import { Slot } from 'expo-router';
import { UserProvider, useUser } from '../context/UserContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function Redirector() {
  const { user } = useUser();
  if (!user) {
    // Optional: show a spinner or let index.js handle role selection
    return null;
  }

  return null;
}

export default function RootLayout() {
  return (
    <UserProvider>
        <Slot />
        <Redirector />
    </UserProvider>
  );
}