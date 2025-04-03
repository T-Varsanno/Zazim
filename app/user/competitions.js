import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockLeaderboard } from '../../Data/mockData';

const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => b.points - a.points);
const topThree = sortedLeaderboard.slice(0, 3);
const rest = sortedLeaderboard.slice(3);

export default function Competitions() {
  const renderCard = (item, rank) => (
    <View style={styles.card}>
      <Text style={styles.rank}>{rank}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Level {item.level}  •  {item.points} נק'</Text>
      </View>
    </View>
  );

  const renderTopThree = () => {
    const podium = [
      { ...topThree[1], emoji: '🥈', size: styles.podiumSecond },
      { ...topThree[0], emoji: '🥇', size: styles.podiumFirst },
      { ...topThree[2], emoji: '🥉', size: styles.podiumThird },
    ];

    return (
      <View style={styles.topThreeContainer}>
        {podium.map((item, index) => (
          <View key={item.id} style={[styles.topCard, item.size]}>
            <Text style={styles.podiumEmoji}>{item.emoji}</Text>
            <Text style={styles.topName}>{item.name}</Text>
            <Text style={styles.topPoints}>{item.points} נק'</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      {/* Fixed Podium Section */}
      <View style={styles.fixedTop}>
        {renderTopThree()}
      </View>

      {/* Scrollable list for 4th place and on */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => renderCard(item, index + 4)}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  fixedTop: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    zIndex: 0,
    elevation: 1,
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  topCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 110,
    paddingVertical: 10,
    elevation: 10,
  },
  podiumFirst: {
    height: 140,
    zIndex: 3,
  },
  podiumSecond: {
    height: 110,
    zIndex: 2,
  },
  podiumThird: {
    height: 90,
    zIndex: 1,
  },
  podiumEmoji: {
    fontSize: 24,
  },
  topName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  topPoints: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
    color: '#4CC9F0',
  },
  info: {
    flex: 1,
    paddingLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
});
