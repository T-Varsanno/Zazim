// app/handler/dashboard.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HandlerDashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Handler Dashboard</Text>

      <Button title="View Users" onPress={() => router.push('/handler/users')} />
      <Button title="Assign Activities" onPress={() => router.push('/handler/assign')} />
      <Button title="Review Progress" onPress={() => router.push('/handler/progress')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
