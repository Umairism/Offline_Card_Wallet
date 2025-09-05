import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BiometricAuth from '../services/BiometricAuth';

export default function AuthScreen({navigation}) {
  const [pin, setPin] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePinAuth = async () => {
    if (pin.length < 4) {
      Alert.alert('Error', 'PIN must be at least 4 digits');
      return;
    }

    // TODO: Implement PIN verification
    navigation.replace('Main');
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await BiometricAuth.authenticate();
      if (result.success) {
        navigation.replace('Main');
      } else {
        Alert.alert('Authentication Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Offline Card Wallet</Text>
        <Text style={styles.subtitle}>Secure • Private • Offline</Text>

        <View style={styles.authContainer}>
          <Text style={styles.label}>Enter PIN</Text>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={setPin}
            placeholder="Enter your PIN"
            secureTextEntry
            keyboardType="numeric"
            maxLength={6}
          />

          <TouchableOpacity style={styles.button} onPress={handlePinAuth}>
            <Text style={styles.buttonText}>
              {isRegistering ? 'Set PIN' : 'Unlock'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.biometricButton}
            onPress={handleBiometricAuth}>
            <Text style={styles.biometricText}>Use Biometric</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  authContainer: {
    width: '100%',
    maxWidth: 300,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pinInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    padding: 16,
    alignItems: 'center',
  },
  biometricText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
