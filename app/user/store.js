import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeItems, userProfile } from '../../Data/mockData';
import { useActivities } from '../../context/ActivitiesContext';

// Force RTL (optional — only once in your app setup, not needed here every render)
// I18nManager.forceRTL(true); // ⚠️ uncomment only if not already set globally

export default function Store() {
  const { activities } = useActivities();
  const [user, setUser] = useState({
    name: userProfile.name,
    points: userProfile.totalPoints,
    ownedItems: [],
  });

  const handlePurchase = (item) => {
    if (user.ownedItems.includes(item.id)) return;

    if (user.points >= item.cost) {
      Alert.alert('🎁 נרכש', `רכשת את ${item.name}`);
      setUser((prev) => ({
        ...prev,
        points: prev.points - item.cost,
        ownedItems: [...prev.ownedItems, item.id],
      }));
    } else {
      Alert.alert('😅 אין מספיק נקודות', 'השלם עוד פעילויות כדי לצבור נקודות.');
    }
  };

  const renderItem = ({ item }) => {
    const isOwned = user.ownedItems.includes(item.id);
    const canAfford = user.points >= item.cost;

    return (
      <TouchableOpacity
        onPress={() => handlePurchase(item)}
        disabled={isOwned || !canAfford}
        style={[
          styles.itemCard,
          isOwned ? styles.owned : canAfford ? styles.unlocked : styles.locked,
        ]}
      >
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCost}>
          {isOwned ? '✅ נרכש' : `${item.cost} נקודות`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>שלום, {user.name}</Text>
        <Text style={styles.points}>נקודות נוכחיות: {user.points}</Text>

        <FlatList
          data={storeItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.storeList}
        />

        <Text style={styles.footer}>צריך עוד נקודות?</Text>
        <Text style={styles.footerSub}>
          נשארו לך {activities.filter((a) => !a.completed).length} פעילויות פתוחות להשלמה.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    direction: 'rtl',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
  },
  points: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'right',
  },
  storeList: {
    gap: 10,
  },
  itemCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemCost: {
    marginTop: 6,
    fontSize: 16,
  },
  unlocked: {
    borderColor: '#6c47ff',
    backgroundColor: '#f4f0ff',
  },
  locked: {
    borderColor: '#aaa',
    backgroundColor: '#eee',
  },
  owned: {
    borderColor: 'green',
    backgroundColor: '#e8ffe8',
  },
  footer: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerSub: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
    marginTop: 4,
  },
});
