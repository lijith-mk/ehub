import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../api/api';

import { CartContext } from '../../context/CartContext';

const CheckoutScreen = ({ navigation, route }) => {
  const { clearCart } = useContext(CartContext);

  const { total } = route.params || { total: 0 };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const placeOrder = async () => {
    if (!name || !phone || !address || !city || !pincode) {
      Alert.alert('Error', 'Please fill all the details');
      return;
    }

    try {
      const user = JSON.parse(
        await AsyncStorage.getItem('user')
      );

      await api.post('/orders', {
        userId: user._id,
      });

      clearCart();

      Alert.alert(
        'Success',
        'Order Placed Successfully'
      );

      navigation.replace('OrderSuccess');

    } catch (error) {
      console.log(error.response?.data || error.message);

      Alert.alert(
        'Error',
        'Unable to place order'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
        style={[styles.input, styles.addressInput]}
      />

      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />

      <TextInput
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="number-pad"
        style={styles.input}
      />

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total Amount: ₹ {total}
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={placeOrder}
      >
        <Text style={styles.buttonText}>
          Place Order
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  totalBox: {
    marginTop: 10,
    marginBottom: 25,
  },

  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  button: {
    backgroundColor: '#16A34A',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;