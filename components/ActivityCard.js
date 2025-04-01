import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Clock } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'expo-router';





export default function ActivityCard({
  title,
  description,
  icon: Icon,
  category,
  completed,
  duration,
  points,
  onComplete
}) {
  
  const router = useRouter();

  const { language, translations } = useLanguage();
  const t = translations[language];
  const isRTL = language === 'he';

  function handleClick() {
    if (category === 'physical') {
      router.push('/user/ExerciseCamera');
    } else {
      onComplete();
    }
  }

  return (
    <View style={[styles.card, isRTL && { flexDirection: 'row-reverse' }]}>
      <View style={[styles.iconWrapper, { backgroundColor: getCategoryColor(category) }]}>
        <Icon size={20} color="#fff" />
      </View>

      <View style={{ flex: 1 }}>
        <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={styles.title}>{title[language]}</Text>
          <Text style={styles.points}>{points} {t.points}</Text>
        </View>
        <Text style={styles.description}>{description[language]}</Text>

        <View style={[styles.footer, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.duration}>
            <Clock size={14} color="#888" />
            <Text style={styles.durationText}>{duration} min</Text>
          </View>

          {completed ? (
            <View style={styles.completed}>
              <CheckCircle size={14} color="#57CC99" />
              <Text style={styles.completedText}>{t.completed}</Text>
            </View>
          ) : (
            
            <TouchableOpacity onPress={handleClick} style={styles.startButton}>
              <Text style={styles.startButtonText}>{t.start}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

function getCategoryColor(category) {
  switch (category) {
    case 'physical': return '#4CC9F0';
    case 'cognitive': return '#9B5DE5';
    case 'social': return '#FF6B6B';
    default: return '#ccc';
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  points: {
    color: '#FFCA3A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#888',
  },
  completed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#57CC99',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#57CC99',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
