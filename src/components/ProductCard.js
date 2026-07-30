import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const ProductCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.details}>

        <Text style={styles.category}>
          {item.category}
        </Text>

        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View style={styles.row}>
          <Text style={styles.rating}>
            ⭐ {item.rating}
          </Text>

          <Text style={styles.price}>
            ₹{item.price}
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Add to Cart
          </Text>
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 4,
  },

  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },

  details: {
    padding: 15,
  },

  category: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  rating: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: '600',
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
  },

  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductCard;