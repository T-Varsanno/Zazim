import React, { useState } from 'react';
import {View,Text,StyleSheet,FlatList,TouchableOpacity,Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storeItems, userProfile } from '../../Data/mockData';
import { useActivities } from '../../context/ActivitiesContext';

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
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.itemImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCost}>
            {isOwned ? '✅ נרכש' : `$${item.cost}`}
          </Text>
          <TouchableOpacity
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
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  const renderStore = ({ item: store }) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.storeName}>{store.storeName}</Text>

      <FlatList
        horizontal
        data={store.items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.horizontalList}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.points}>נקודות נוכחיות: {user.points}</Text>
          {storeItems.map((store) => (
            <View key={store.storeId} style={{ marginBottom: 30 }}>
              {renderStore({ item: store })}
            </View>
          ))}
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
    width: 220,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    marginRight: 10,
  },
  imageContainer: {
    width: '100%',
    height: 140,
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
  scrollContainer: {
    paddingBottom: 40,
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
  points: {
    color: '#555',
    textAlign: 'center'
  },
  storeName: {
    fontWeight: 'bold',
    marginLeft :20,
    textAlign: 'left'
  }
});
