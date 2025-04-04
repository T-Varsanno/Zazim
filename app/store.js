import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeItems, userProfile } from '../Data/mockData';
import { useActivities } from '../context/ActivitiesContext';

export default function Store() {
  const { activities } = useActivities();

  const [user, setUser] = useState({
    name: userProfile.name,
    points: userProfile.totalPoints,
    ownedItems: [],
  });

  const SCROLL_THRESHOLD = 5;
  let startX = 0;

  const handleTouchStart = (e) => {
    startX = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e, onTap) => {
    const endX = e.nativeEvent.pageX;
    const distance = Math.abs(endX - startX);
    if (distance < SCROLL_THRESHOLD) {
      onTap(); // Only trigger tap if not scrolling
    }
  };

  const handlePurchase = (item) => {
    if (user.ownedItems.includes(item.id)) return;

    if (user.points >= item.cost) {
      alert(`🎁 נרכש: ${item.name}`);
      setUser((prev) => ({
        ...prev,
        points: prev.points - item.cost,
        ownedItems: [...prev.ownedItems, item.id],
      }));
    } else {
      alert('😅 אין מספיק נקודות. השלם עוד פעילויות כדי לצבור נקודות.');
    }
  };

  const renderItemCard = (item, storeName) => {
    const fullItem = { ...item, storeName };
    const isOwned = user.ownedItems.includes(item.id);
    const canAfford = user.points >= item.cost;

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCost}>
            {isOwned ? '✅ נרכש' : `${item.cost} נקודות`}
          </Text>
          <TouchableWithoutFeedback
            onPressIn={handleTouchStart}
            onPressOut={(e) => handleTouchEnd(e, () => handlePurchase(fullItem))}
          >
            <View style={[styles.buyButton, isOwned ? styles.buttonDisabled : {}]}>
              <Text style={styles.buyButtonText}>
                {isOwned ? 'נרכש' : 'קנה אותי !'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}>
        <View style={styles.header}>
          <Text style={styles.points}>הנקודות שלי: {user.points}</Text>
        </View>

        {storeItems.map((store) => (
          <View key={store.storeName} style={{ marginBottom: 24 }}>
            <Text style={styles.storeName}>{store.storeName}</Text>
            <FlatList
              data={store.items}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: 'row-reverse' }}
              renderItem={({ item }) => renderItemCard(item, store.storeName)}
            />
          </View>
        ))}

        <View style={styles.footerContainer}>
          <Text style={styles.footer}>צריך עוד נקודות?</Text>
          <Text style={styles.footerSub}>
            נשארו לך {activities.filter((a) => !a.completed).length} פעילויות פתוחות להשלמה.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 240,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  storeName: {
    fontWeight: 'bold',
    fontSize: 16,
    padding: 6,
    paddingLeft: 10,
    color: '#555',
    backgroundColor: '#f5f5f5',
    textAlign: 'right',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
    textAlign: 'center',
  },
  itemCost: {
    fontSize: 16,
    color: '#7d7d7d',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#ff8c00',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  points: {
    fontSize: 18,
    color: '#555',
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footer: {
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
