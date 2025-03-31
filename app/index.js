import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ActivityCard from '../components/ActivityCard';

import { Dumbbell, BookOpen } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useActivities } from '../context/ActivitiesContext';
import {  userProfile } from '../Data/mockData';

export default function Index() {
  const { language, translations } = useLanguage();
  const { activities, markActivityCompleted } = useActivities();
  const t = translations[language];
  const isRTL = language === 'he';
  // Show just today's top 2–3 activities
  const todaysActivities = activities.slice(0, 2);


  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Greeting Header */}
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={styles.title}>{t.greeting}, {userProfile.name[language]}!</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {userProfile.level}</Text>
        </View>
      </View>

      {/* Section Title */}
      <View style={{ marginTop: 20 }}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t.todaysGoal}
        </Text>

        {/* Render each activity card */}
        {todaysActivities.map((activity) => (
          <ActivityCard 
          key={activity.id} 
          {...activity}
          onComplete={() => markActivityCompleted(activity.id)}
          />
        ))}
      </View>
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