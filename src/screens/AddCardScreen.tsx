import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CardService} from '../services/CardService';

const cardColors = [
  '#007AFF', '#34C759', '#FF9500', '#AF52DE',
  '#FF3B30', '#00C7BE', '#5856D6', '#FF2D92'
];

export default function AddCardScreen({navigation}) {
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    type: 'credit',
    category: '',
    color: '#007AFF',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!cardData.name.trim()) {
      newErrors.name = 'Card name is required';
    }

    if (!cardData.number.trim() || cardData.number.length < 13) {
      newErrors.number = 'Valid card number is required';
    }

    if (!cardData.expiryMonth || cardData.expiryMonth.length !== 2) {
      newErrors.expiryMonth = 'Valid month is required (MM)';
    }

    if (!cardData.expiryYear || cardData.expiryYear.length !== 2) {
      newErrors.expiryYear = 'Valid year is required (YY)';
    }

    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await CardService.addCard({
        name: cardData.name,
        number: cardData.number.replace(/\s/g, ''),
        expiryMonth: cardData.expiryMonth,
        expiryYear: cardData.expiryYear,
        cvv: cardData.cvv,
        type: cardData.type,
        category: cardData.category,
        color: cardData.color,
      });

      Alert.alert('Success', 'Card added successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ');
    return formatted.trim();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Card</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Card Preview */}
        <View style={[styles.cardPreview, {backgroundColor: cardData.color}]}>
          <Text style={styles.previewName}>
            {cardData.name || 'Card Name'}
          </Text>
          <Text style={styles.previewNumber}>
            {formatCardNumber(cardData.number) || '**** **** **** ****'}
          </Text>
          <View style={styles.previewFooter}>
            <Text style={styles.previewExpiry}>
              {cardData.expiryMonth || 'MM'}/{cardData.expiryYear || 'YY'}
            </Text>
            <Text style={styles.previewType}>
              {cardData.type.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={cardData.name}
              onChangeText={(text) => setCardData({...cardData, name: text})}
              placeholder="My Credit Card"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={[styles.input, errors.number && styles.inputError]}
              value={formatCardNumber(cardData.number)}
              onChangeText={(text) => 
                setCardData({...cardData, number: text.replace(/\s/g, '')})
              }
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
            {errors.number && <Text style={styles.errorText}>{errors.number}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
              <Text style={styles.label}>Expiry Month</Text>
              <TextInput
                style={[styles.input, errors.expiryMonth && styles.inputError]}
                value={cardData.expiryMonth}
                onChangeText={(text) => 
                  setCardData({...cardData, expiryMonth: text})
                }
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
              />
              {errors.expiryMonth && (
                <Text style={styles.errorText}>{errors.expiryMonth}</Text>
              )}
            </View>

            <View style={[styles.inputGroup, {flex: 1, marginLeft: 10}]}>
              <Text style={styles.label}>Expiry Year</Text>
              <TextInput
                style={[styles.input, errors.expiryYear && styles.inputError]}
                value={cardData.expiryYear}
                onChangeText={(text) => 
                  setCardData({...cardData, expiryYear: text})
                }
                placeholder="YY"
                keyboardType="numeric"
                maxLength={2}
              />
              {errors.expiryYear && (
                <Text style={styles.errorText}>{errors.expiryYear}</Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={[styles.input, errors.cvv && styles.inputError]}
              value={cardData.cvv}
              onChangeText={(text) => setCardData({...cardData, cvv: text})}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
            {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Type</Text>
            <View style={styles.typeContainer}>
              {['credit', 'debit', 'loyalty', 'membership'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    cardData.type === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setCardData({...cardData, type: type})}>
                  <Text
                    style={[
                      styles.typeText,
                      cardData.type === type && styles.typeTextActive,
                    ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Color</Text>
            <View style={styles.colorContainer}>
              {cardColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    {backgroundColor: color},
                    cardData.color === color && styles.colorOptionActive,
                  ]}
                  onPress={() => setCardData({...cardData, color: color})}
                />
              ))}
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cardPreview: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    minHeight: 200,
  },
  previewName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  previewNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 30,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewExpiry: {
    fontSize: 14,
    color: '#fff',
  },
  previewType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  typeTextActive: {
    color: '#fff',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionActive: {
    borderColor: '#333',
  },
});
