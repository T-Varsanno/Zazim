import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import ActivityCard from '../components/ActivityCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActivities } from '../context/ActivitiesContext';
import { userProfile } from '../Data/mockData';
import * as Progress from 'react-native-progress'; 

export default function Index() {
  const { activities, markActivityCompleted } = useActivities();
  const todaysActivities = activities.slice(0, 6);

  const completed = activities.filter((a) => a.completed);
  const progress = activities.length === 0 ? 0 : completed.length / activities.length;

  const [showCongratsModal, setShowCongratsModal] = useState(false);

  useEffect(() => {
    if (progress === 1) {
      setShowCongratsModal(true);
    }
  }, [progress]);

  const t = {
    greeting: 'שלום',
    home: 'בית',
    activities: 'פעילויות',
    achievements: 'הישגים',
    profile: 'פרופיל',
    start: 'התחל',
    completed: 'הושלם',
    points: 'נקודות',
    todaysGoal: 'מטרות היום',
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

        {/* Activity Cards */}
        {todaysActivities.map((activity) => (
          <ActivityCard 
            key={activity.id} 
            {...activity}
            onComplete={() => markActivityCompleted(activity.id)}
          />
        ))}
      </ScrollView>

      {/* 🎉 Congrats Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showCongratsModal}
        onRequestClose={() => setShowCongratsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.modalTitle}>כל הכבוד!</Text>
            <Text style={styles.modalMessage}>סיימת את כל המשימות שלך להיום 👏</Text>
            <Pressable style={styles.modalButton} onPress={() => setShowCongratsModal(false)}>
              <Text style={styles.modalButtonText}>הבנתי 😊</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  // 🎉 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    elevation: 8,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CC9F0',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: '#444',
  },
  modalButton: {
    backgroundColor: '#4CC9F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
