import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { achievements } from '../../Data/mockData';

export default function Achievements() {
  t = {
    greeting: 'שלום',
    home: 'בית',
    activities: 'פעילויות',
    achievements: 'הישגים',
    profile: 'פרופיל',
    start: 'התחל',
    completed: 'הושלם',
    points: 'נקודות',
    todaysGoal: 'מטרת היום',
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Page Title */}
        <Text style={[styles.title]}>
          {t.achievements}
        </Text>
        {/* Achievements Grid */}
        <View style={styles.grid}>
          {achievements.map((a) => (
            <View
              key={a.id}
              style={[styles.card]}
            >
              <View
                style={[
                  styles.badge,
                  { backgroundColor: a.unlocked ? '#4CC9F0' : '#ccc' },
                ]}
              >
                <a.icon size={20} color="#fff" />
              </View>
              <Text
                style={[
                  styles.badgeTitle,
                ]}
              >
                {a.title}
              </Text>
              <Text
                style={[
                  styles.badgeDesc,
                  { textAlign:'center' },
                ]}
              >
                {a.description}
              </Text>
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    elevation: 1,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CC9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  badgeDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
