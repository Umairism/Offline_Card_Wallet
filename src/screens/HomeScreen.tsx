import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CardService} from '../services/CardService';

export default function HomeScreen({navigation}) {
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState({
    totalCards: 0,
    recentTransactions: 0,
  });

  useEffect(() => {
    loadCards();
    loadStats();
  }, []);

  const loadCards = async () => {
    try {
      const cardData = await CardService.getAllCards();
      setCards(cardData.slice(0, 3)); // Show only first 3 cards
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const loadStats = async () => {
    try {
      const totalCards = await CardService.getCardCount();
      setStats({
        totalCards,
        recentTransactions: 0, // TODO: Implement transaction count
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Add Card',
      icon: 'add-card',
      onPress: () => navigation.navigate('AddCard'),
      color: '#007AFF',
    },
    {
      title: 'Scan QR',
      icon: 'qr-code-scanner',
      onPress: () => navigation.navigate('Payment', {mode: 'scan'}),
      color: '#34C759',
    },
    {
      title: 'NFC Pay',
      icon: 'nfc',
      onPress: () => navigation.navigate('Payment', {mode: 'nfc'}),
      color: '#FF9500',
    },
    {
      title: 'Backup',
      icon: 'backup',
      onPress: () => Alert.alert('Backup', 'Backup feature coming soon!'),
      color: '#AF52DE',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.title}>Your Wallet</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalCards}</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.recentTransactions}</Text>
            <Text style={styles.statLabel}>Recent Transactions</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, {backgroundColor: action.color}]}
                onPress={action.onPress}>
                <Icon name={action.icon} size={24} color="#fff" />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Cards</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cards')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {cards.map((card, index) => (
            <View key={index} style={styles.cardPreview}>
              <View style={styles.cardIcon}>
                <Icon name="credit-card" size={24} color="#007AFF" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.name || 'Card'}</Text>
                <Text style={styles.cardNumber}>****{card.lastFour}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
  },
});
