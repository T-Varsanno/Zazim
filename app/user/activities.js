import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ActivityCard from '../../components/ActivityCard';
import { useLanguage } from '../../context/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivities } from '../../context/ActivitiesContext';
import * as Progress from 'react-native-progress'; // Make sure to install this

export default function Activities() {
  const { language, translations } = useLanguage();
  const { activities, markActivityCompleted } = useActivities();
  const t = translations[language];
  const isRTL = language === 'he';

  const completed = activities.filter((a) => a.completed);
  const notCompleted = activities.filter((a) => !a.completed);

  const progress = activities.length === 0 ? 0 : completed.length / activities.length;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t.activities}
        </Text>

        <Progress.Bar
          progress={progress}
          width={null}
          color="#6c47ff"
          unfilledColor="#e6e6e6"
          borderWidth={0}
          height={10}
          borderRadius={5}
          style={{ marginBottom: 20 }}
        />

        {notCompleted.length > 0 && (
          <Text style={[styles.sectionHeader, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t.stillToDo || 'Still To Do'}
          </Text>
        )}
        {notCompleted.map((activity) => (
          <ActivityCard
            key={activity.id}
            {...activity}
            onComplete={() => markActivityCompleted(activity.id)}
          />
        ))}

        {completed.length > 0 && (
          <Text style={[styles.sectionHeader, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t.completed || 'Completed'}
          </Text>
        )}
        {completed.map((activity) => (
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
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    marginTop: 10,
  },
});
