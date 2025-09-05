import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';

interface Card {
  id: number;
  name: string;
  number: string;
  type: string;
  balance: string;
  cvv: string;
  expiry: string;
}

interface Transaction {
  id: number;
  type: 'payment' | 'received';
  amount: string;
  description: string;
  date: string;
  cardId: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      name: 'Main Card',
      number: '4532 1234 5678 9012',
      type: 'Visa',
      balance: '$2,450.00',
      cvv: '123',
      expiry: '12/26',
    },
    {
      id: 2,
      name: 'Savings Card',
      number: '5555 4444 3333 2222',
      type: 'Mastercard',
      balance: '$8,920.50',
      cvv: '456',
      expiry: '03/27',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'payment',
      amount: '-$25.50',
      description: 'Coffee Shop',
      date: '2025-08-31',
      cardId: 1,
    },
    {
      id: 2,
      type: 'received',
      amount: '+$1,200.00',
      description: 'Salary Deposit',
      date: '2025-08-30',
      cardId: 2,
    },
    {
      id: 3,
      type: 'payment',
      amount: '-$89.99',
      description: 'Online Shopping',
      date: '2025-08-29',
      cardId: 1,
    },
  ]);

  const [newCard, setNewCard] = useState({
    name: '',
    number: '',
    type: 'Visa',
    cvv: '',
    expiry: '',
  });

  const handleCardPress = (card: Card) => {
    Alert.alert(
      'Card Details',
      `${card.name}\n${card.number}\nType: ${card.type}\nExpiry: ${card.expiry}\nBalance: ${card.balance}`,
      [
        {text: 'OK'},
        {text: 'Use for Payment', onPress: () => handleNFCPayment(card)},
      ]
    );
  };

  const handleAddCard = () => {
    if (newCard.name && newCard.number && newCard.cvv && newCard.expiry) {
      const card: Card = {
        id: cards.length + 1,
        name: newCard.name,
        number: newCard.number,
        type: newCard.type,
        balance: '$0.00',
        cvv: newCard.cvv,
        expiry: newCard.expiry,
      };
      setCards([...cards, card]);
      setNewCard({name: '', number: '', type: 'Visa', cvv: '', expiry: ''});
      setShowAddCard(false);
      Alert.alert('Success', 'Card added successfully!');
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  const handleNFCPayment = (card: Card) => {
    Alert.alert(
      'NFC Payment',
      `Ready to pay with ${card.name}\nHold your device near the NFC reader`,
      [
        {text: 'Cancel'},
        {
          text: 'Simulate Payment',
          onPress: () => simulatePayment(card),
        },
      ]
    );
  };

  const simulatePayment = (card: Card) => {
    const amount = Math.floor(Math.random() * 100) + 10;
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: 'payment',
      amount: `-$${amount}.00`,
      description: 'NFC Payment',
      date: new Date().toISOString().split('T')[0],
      cardId: card.id,
    };
    setTransactions([newTransaction, ...transactions]);
    Alert.alert('Payment Successful', `Paid $${amount}.00 with ${card.name}`);
  };

  const handleQRPayment = () => {
    Alert.alert(
      'QR Payment',
      'QR Scanner would open here',
      [
        {text: 'Cancel'},
        {
          text: 'Simulate QR Payment',
          onPress: () => {
            if (cards.length > 0) {
              simulatePayment(cards[0]);
            }
          },
        },
      ]
    );
  };

  const renderHome = () => (
    <ScrollView style={styles.content}>
      {/* Cards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Cards ({cards.length})</Text>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.cardItem}
            onPress={() => handleCardPress(card)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardType}>{card.type}</Text>
            </View>
            <Text style={styles.cardNumber}>
              **** **** **** {card.number.slice(-4)}
            </Text>
            <Text style={styles.cardBalance}>{card.balance}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowAddCard(true)}
        >
          <Text style={styles.addButtonText}>+ Add New Card</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => cards.length > 0 ? handleNFCPayment(cards[0]) : Alert.alert('No Cards', 'Please add a card first')}
          >
            <Text style={styles.actionIcon}>💳</Text>
            <Text style={styles.actionText}>NFC Pay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleQRPayment}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>QR Pay</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setCurrentScreen('history')}
          >
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.slice(0, 3).map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDesc}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              {color: transaction.type === 'received' ? '#4CAF50' : '#F44336'}
            ]}>
              {transaction.amount}
            </Text>
          </View>
        ))}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setCurrentScreen('history')}
        >
          <Text style={styles.viewAllText}>View All Transactions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderHistory = () => (
    <View style={styles.content}>
      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Transaction History</Text>
      </View>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDesc}>{item.description}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={styles.transactionCard}>
                Card: {cards.find(c => c.id === item.cardId)?.name || 'Unknown'}
              </Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              {color: item.type === 'received' ? '#4CAF50' : '#F44336'}
            ]}>
              {item.amount}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Offline Card Wallet</Text>
        <Text style={styles.subtitle}>Your secure digital wallet</Text>
      </View>

      {/* Main Content */}
      {currentScreen === 'home' ? renderHome() : renderHistory()}

      {/* Add Card Modal */}
      <Modal visible={showAddCard} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Card</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Card Name"
              value={newCard.name}
              onChangeText={(text) => setNewCard({...newCard, name: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Card Number (1234 5678 9012 3456)"
              value={newCard.number}
              onChangeText={(text) => setNewCard({...newCard, number: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={newCard.cvv}
              onChangeText={(text) => setNewCard({...newCard, cvv: text})}
              keyboardType="numeric"
              maxLength={3}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Expiry (MM/YY)"
              value={newCard.expiry}
              onChangeText={(text) => setNewCard({...newCard, expiry: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddCard(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddCard}
              >
                <Text style={styles.saveButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Security Settings</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Backup & Sync</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>App Preferences</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>About</Text>
              <Text style={styles.settingArrow}>→</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 15,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardType: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  cardNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  cardBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'white',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  transactionCard: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
