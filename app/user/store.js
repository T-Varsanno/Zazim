import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeItems, userProfile } from '../../Data/mockData';
import { useActivities } from '../../context/ActivitiesContext';
import { PressableOpacity } from 'react-native-pressable-opacity';

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

  // Flatten storeItems to a single list
  const flatStoreItems = storeItems.flatMap((store) =>
    store.items.map((item) => ({ ...item, storeName: store.storeName }))
  );

  const renderItem = ({ item }) => {
    const isOwned = user.ownedItems.includes(item.id);
    const canAfford = user.points >= item.cost;

    return (
      <View style={styles.card}>
        <Text style={styles.storeName}>{item.storeName}</Text>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.itemImage} resizeMode="cover" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCost}>
            {isOwned ? '✅ נרכש' : `${item.cost} נקודות`}
          </Text>
          <PressableOpacity
            onPress={() => handlePurchase(item)}
            disabled={isOwned || !canAfford}
            style={[
              styles.buyButton,
              isOwned ? styles.buttonDisabled : {},
            ]}
          >
            <Text style={styles.buyButtonText}>
              {isOwned ? 'נרכש' : 'קנה אותי !'}
            </Text>
          </PressableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={flatStoreItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.points}>נקודות נוכחיות: {user.points}</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Text style={styles.footer}>צריך עוד נקודות?</Text>
            <Text style={styles.footerSub}>
              נשארו לך {activities.filter((a) => !a.completed).length} פעילויות פתוחות להשלמה.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
    fontSize: 14,
    padding: 6,
    paddingLeft: 10,
    color: '#555',
    backgroundColor: '#f5f5f5',
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
  gridRow: {
    justifyContent: 'space-between',
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
