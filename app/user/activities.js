import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ActivityCard from '../../components/ActivityCard';
import { Dumbbell, BookOpen, Users } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivities } from '../../context/ActivitiesContext';

export default function Activities() {
  const { language, translations } = useLanguage();
  const { activities, markActivityCompleted } = useActivities();
  const t = translations[language];
  const isRTL = language === 'he';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t.activities}
        </Text>

        {activities.map((activity) => (
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});