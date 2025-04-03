import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockLeaderboard, userProfile } from '../../Data/mockData';

export default function Competitions() {
  const [selectedTab, setSelectedTab] = useState('individual');
  const [expandedGroupId, setExpandedGroupId] = useState(null);

  const individualSorted = [...mockLeaderboard.individual].sort((a, b) => b.points - a.points);
  const topThreeIndividuals = individualSorted.slice(0, 3);
  const restIndividuals = individualSorted.slice(3);

  const groupSorted = [...mockLeaderboard.groups].sort((a, b) => b.points - a.points);
  const myGroupId = userProfile.groupId;

  const toggleExpand = (groupId) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  const getBorderColor = (index) => {
    switch (index) {
      case 0: return '#FFD700';
      case 1: return '#C0C0C0';
      case 2: return '#CD7F32';
      default: return '#ddd';
    }
  };

  const getTrophy = (index) => {
    switch (index) {
      case 0: return '🏆';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '';
    }
  };

  const renderIndividualCard = (item, rank) => {
    const isUser = item.id === userProfile.id;

    return (
      <View style={[
        styles.simpleCard,
        isUser && styles.userGroupHighlight
      ]}>
        <Text style={styles.rank}>{rank}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name} {isUser && '⭐'}
          </Text>
          <Text style={styles.details}>Level {item.level} • {item.points} נק'</Text>
        </View>
      </View>
    );
  };

  const renderIndividualPodium = () => {
  const podium = [
    { item: topThreeIndividuals[1], emoji: '🥈', style: styles.podiumSecond },
    { item: topThreeIndividuals[0], emoji: '🥇', style: styles.podiumFirst },
    { item: topThreeIndividuals[2], emoji: '🥉', style: styles.podiumThird },
  ];

  return (
    <View style={styles.topThreeContainer}>
      {podium.map(({ item, emoji, style }) => {
        const isUser = item.id === userProfile.id;
        return (
          <View
            key={item.id}
            style={[
              styles.topCard,
              style,
              isUser && styles.userGroupHighlight // 💙 Add highlight if it's the user
            ]}
          >
            <Text style={styles.podiumEmoji}>{emoji}</Text>
            <Text style={styles.topName}>
              {item.name} {isUser && '⭐'}
            </Text>
            <Text style={styles.topPoints}>{item.points} נק'</Text>
          </View>
        );
      })}
    </View>
  );
};

  const renderGroup = ({ item, index }) => {
    const isTopThree = index < 3;
    const isUserGroup = item.id === myGroupId;

    return (
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        style={[
          styles.groupCard,
          isTopThree && { borderColor: getBorderColor(index), borderWidth: 2 },
          isUserGroup && styles.userGroupHighlight,
        ]}
      >
        <View style={styles.groupHeader}>
          {isTopThree && <Text style={styles.groupTrophy}>{getTrophy(index)}</Text>}
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>
              {index + 1}. {item.name}
            </Text>
            <Text style={styles.groupPoints}>{item.points} נק'</Text>
          </View>
        </View>

        {expandedGroupId === item.id && (
          <View style={styles.memberList}>
            {item.members && item.members.length > 0 ? (
              item.members.map((member) => (
                <View key={member.id} style={styles.memberItem}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberPoints}>{member.contribution} נק'</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMembers}>אין חברים להצגה</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, selectedTab === 'individual' && styles.toggleActive]}
          onPress={() => setSelectedTab('individual')}
        >
          <Text style={[styles.toggleText, selectedTab === 'individual' && styles.toggleTextActive]}>
            דירוג אישי 🧍
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, selectedTab === 'group' && styles.toggleActive]}
          onPress={() => setSelectedTab('group')}
        >
          <Text style={[styles.toggleText, selectedTab === 'group' && styles.toggleTextActive]}>
            דירוג קבוצתי 👥
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'individual' ? (
        <>
          <View style={styles.fixedTop}>{renderIndividualPodium()}</View>
          <FlatList
            data={restIndividuals}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => renderIndividualCard(item, index + 4)}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <>
          <FlatList
            data={groupSorted}
            keyExtractor={(item) => item.id}
            renderItem={renderGroup}
            contentContainerStyle={styles.scrollContainer}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  toggleTextActive: {
    color: '#000',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
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
    textAlign: 'center',
  },
  topPoints: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  userGroupHighlight: {
    backgroundColor: '#c0e4ff',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTrophy: {
    fontSize: 28,
    marginRight: 10,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupPoints: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  memberList: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  memberName: {
    fontSize: 14,
    color: '#333',
  },
  memberPoints: {
    fontSize: 14,
    fontWeight: '600',
  },
  noMembers: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  simpleCard: {
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
