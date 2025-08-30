import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function TransactionHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <Text style={styles.subtitle}>Transaction logging features coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
