import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';

import { CartContext } from '../../context/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>

        <Text>Quantity: {item.quantity}</Text>

        <Text style={styles.price}>
          ₹ {item.price}
        </Text>

        {/* Remove Button */}
        <Pressable
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.removeText}>
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Your cart is empty.
          </Text>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.total}>
          Total: ₹ {total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },

  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  details: {
    marginLeft: 15,
    justifyContent: 'center',
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  price: {
    color: '#0A84FF',
    fontWeight: 'bold',
    marginTop: 5,
  },

  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  removeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
  },

  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 15,
  },

  total: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default CartScreen;