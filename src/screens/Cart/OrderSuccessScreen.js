import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

const OrderSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>

      <Text style={styles.title}>
        Order Placed!
      </Text>

      <Text style={styles.message}>
        Thank you for shopping with Ehub.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>
          Continue Shopping
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },

  icon: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderSuccessScreen;