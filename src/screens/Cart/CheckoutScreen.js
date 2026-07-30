import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import { CartContext } from '../../context/CartContext';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems } = useContext(CartContext);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  const total = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const placeOrder = () => {
    if (!name || !phone || !address || !city || !pincode) {
      Alert.alert('Error', 'Please fill all the details');
      return;
    }

    Alert.alert(
      'Order Placed',
      'Your order has been placed successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ],
    );
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