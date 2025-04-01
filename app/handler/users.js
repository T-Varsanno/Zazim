import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const mockUsers = [
  { id: 1, name: 'David Levi' },
  { id: 2, name: 'Sara Cohen' },
  { id: 3, name: 'Rami Kaplan' },
];

export default function UsersList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="⬅ Back to Dashboard" onPress={() => router.push('/handler/dashboard')} />

      <Text style={styles.title}>Users</Text>

      <FlatList
        data={mockUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item.name}</Text>
            <Button title="Assign Activities" onPress={() => router.push('/handler/assign')} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  userCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
});
