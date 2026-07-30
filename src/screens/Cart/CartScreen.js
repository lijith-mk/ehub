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

const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

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

        <View style={styles.quantityContainer}>
          <Pressable
            style={styles.qtyButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>
            {item.quantity}
          </Text>

          <Pressable
            style={styles.qtyButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>

        <Text style={styles.price}>
          ₹ {item.price}
        </Text>

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

        <Pressable
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>
            Proceed to Checkout
          </Text>
        </Pressable>
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
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  details: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  qtyButton: {
    width: 35,
    height: 35,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },

  qtyButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  qtyText: {
    marginHorizontal: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },

  price: {
    marginTop: 10,
    color: '#2563EB',
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 15,
  },

  checkoutButton: {
    backgroundColor: '#16A34A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;