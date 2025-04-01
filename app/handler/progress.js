import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { userProfile } from '../../Data/mockData';
import { useRouter } from 'expo-router';

export default function ProgressReview() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="⬅ Back to Dashboard" onPress={() => router.push('/handler/dashboard')} />

      <Text style={styles.title}>Progress for {userProfile.name.en}</Text>

      <View style={styles.progressBox}>
        <Text style={styles.stat}>Current Streak: {userProfile.currentStreak} days</Text>
        <Text style={styles.stat}>Total Points: {userProfile.totalPoints}</Text>
        <Text style={styles.stat}>Activities Completed:</Text>
        <Text style={styles.sub}>- Physical: {userProfile.activityStats.physical}</Text>
        <Text style={styles.sub}>- Cognitive: {userProfile.activityStats.cognitive}</Text>
        <Text style={styles.sub}>- Social: {userProfile.activityStats.social}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  progressBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  stat: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
});
