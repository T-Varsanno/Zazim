import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ActivityCard from '../../components/ActivityCard';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivities } from '../../context/ActivitiesContext';
import { userProfile } from '../../Data/mockData';
import * as Progress from 'react-native-progress'; 

export default function Index() {
  const { activities, markActivityCompleted } = useActivities();
  const todaysActivities = activities.slice(0, 6);

  const completed = activities.filter((a) => a.completed);
  const progress = activities.length === 0 ? 0 : completed.length / activities.length;

  const t = {
    greeting: 'שלום',
    home: 'בית',
    activities: 'פעילויות',
    achievements: 'הישגים',
    profile: 'פרופיל',
    start: 'התחל',
    completed: 'הושלם',
    points: 'נקודות',
    todaysGoal: 'מטרת היום',
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Greeting Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.greeting}, {userProfile.name}!</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {userProfile.level}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <Progress.Bar
          progress={progress}
          width={null}
          color="#6c47ff"
          unfilledColor="#e6e6e6"
          borderWidth={0}
          height={10}
          borderRadius={5}
          style={{ marginVertical: 20 }}
        />

        {/* Section Title */}
        <Text style={styles.sectionTitle}>{t.todaysGoal}</Text>

        {/* Render each activity card */}
        {todaysActivities.map((activity) => (
          <ActivityCard 
            key={activity.id} 
            {...activity}
            onComplete={() => markActivityCompleted(activity.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#4CC9F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
});
