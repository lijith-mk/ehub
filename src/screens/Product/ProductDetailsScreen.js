import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.rating}>
          ⭐ {product.rating}
        </Text>

        <Text style={styles.price}>
          ₹ {product.price}
        </Text>

        <Text style={styles.title}>
          Description
        </Text>

        <Text style={styles.description}>
          {product.description}
        </Text>

        {/* Quantity Section */}
        <View style={styles.quantityContainer}>
          <Text style={styles.title}>Quantity</Text>

          <View style={styles.quantityBox}>
            <Text
              style={styles.button}
              onPress={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              -
            </Text>

            <Text style={styles.quantityText}>
              {quantity}
            </Text>

            <Text
              style={styles.button}
              onPress={() => setQuantity(quantity + 1)}
            >
              +
            </Text>
          </View>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.cartButton}>
          <Text style={styles.cartButtonText}>
            🛒 Add to Cart
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  image: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
  },

  detailsContainer: {
    padding: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },

  rating: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },

  price: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A84FF',
  },

  title: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: '600',
  },

  description: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },

  quantityContainer: {
    marginTop: 30,
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  button: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#0A84FF',
    color: '#fff',
    borderRadius: 8,
  },

  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },

  cartButton: {
    backgroundColor: '#0A84FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  cartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsScreen;