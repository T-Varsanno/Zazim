import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { activities } from '../../Data/mockData';
import { useRouter } from 'expo-router';

export default function AssignActivities() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="⬅ Back to Dashboard" onPress={() => router.push('/handler/dashboard')} />

      <Text style={styles.title}>Assign Activities</Text>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.activityTitle}>{item.title.en}</Text>
            <Text style={styles.activityDesc}>{item.description.en}</Text>
            <Button title="Assign to User" onPress={() => alert(`Assigned "${item.title.en}"`)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  card: {
    backgroundColor: '#e0f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityTitle: { fontSize: 16, fontWeight: 'bold' },
  activityDesc: { fontSize: 13, color: '#555', marginBottom: 6 },
});
