import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import { useRouter } from 'expo-router';

export default function TempHome() {
  const { setUser } = useUser();
  const router = useRouter();

  const handleSelect = (type) => {
    setUser({ name: type === 'user' ? 'David' : 'HandlerAdmin', type });
    router.replace(type === 'user' ? '/user' : '/handler/dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temporary Role Select</Text>
      <Button title="Log in as User" onPress={() => handleSelect('user')} />
      <View style={{ height: 16 }} />
      <Button title="Log in as Handler" onPress={() => handleSelect('handler')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
});
