import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar, Award, BarChart3, Settings } from 'lucide-react-native';
import { userProfile } from '../../Data/mockData';

export default function Profile() {
  const { language, translations } = useLanguage();
  const t = translations[language];
  const isRTL = language === 'he';


  const progressBar = (value, color) => (
    <View style={styles.barWrapper}>
      <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile.name[language].split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{userProfile.name[language]}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {userProfile.level}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Calendar size={16} color="#4CC9F0" />
              <Text style={styles.cardTitle}>{isRTL ? 'רצף נוכחי' : 'Current Streak'}</Text>
            </View>
            <Text style={styles.cardValue}>{userProfile.currentStreak} {t.days}</Text>
            <Text style={styles.cardSubtitle}>
              {isRTL ? 'הכי ארוך:' : 'Longest:'} {userProfile.longestStreak} {t.days}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Award size={16} color="#FF6B6B" />
              <Text style={styles.cardTitle}>{isRTL ? 'סה"כ נקודות' : 'Total Points'}</Text>
            </View>
            <Text style={styles.cardValue}>{userProfile.totalPoints}</Text>
            <Text style={styles.cardSubtitle}>
              {userProfile.nextLevelPoints - userProfile.totalPoints} {isRTL ? 'לרמה הבאה' : 'to next level'}
            </Text>
          </View>
        </View>

        {/* Activity Stats */}
        <View style={styles.statsSection}>
          <View style={[styles.statsHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <BarChart3 size={18} color="#57CC99" />
            <Text style={styles.cardTitle}>{isRTL ? 'סטטיסטיקת פעילויות' : 'Activity Stats'}</Text>
          </View>

          {[
            { label: isRTL ? 'פיזי' : 'Physical', value: 52, count: userProfile.activityStats.physical, color: '#4CC9F0' },
            { label: isRTL ? 'קוגניטיבי' : 'Cognitive', value: 34, count: userProfile.activityStats.cognitive, color: '#9B5DE5' },
            { label: isRTL ? 'חברתי' : 'Social', value: 14, count: userProfile.activityStats.social, color: '#FF6B6B' },
          ].map((item, index) => (
            <View key={index} style={styles.statBlock}>
              <View style={[styles.statRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statCount}>{item.count}</Text>
              </View>
              {progressBar(item.value, item.color)}
            </View>
          ))}
        </View>

        {/* Settings Button */}
        <View style={styles.settings}>
          <Settings size={18} color="#666" />
          <Text style={styles.settingsText}>{isRTL ? 'הגדרות' : 'Settings'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: '#4CC9F0',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  levelBadge: {
    backgroundColor: '#4CC9F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statBlock: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statCount: {
    fontWeight: 'bold',
  },
  barWrapper: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  settings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  settingsText: {
    fontSize: 14,
    color: '#666',
  },
});