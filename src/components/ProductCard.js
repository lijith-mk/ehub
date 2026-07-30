import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import COLORS from '../theme/colors';
import SPACING from '../theme/spacing';
import TYPOGRAPHY from '../theme/typography';
import SHADOWS from '../theme/shadows';

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
          numberOfLines={2}
          style={styles.name}
        >
          {item.name}
        </Text>

        <Text style={styles.rating}>
          ⭐ {item.rating}
        </Text>

        <Text style={styles.price}>
          ₹{item.price}
        </Text>

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
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    margin: 8,
    overflow: 'hidden',
    ...SHADOWS.card,
  },

  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },

  details: {
    padding: SPACING.md,
  },

  category: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: TYPOGRAPHY.titleWeight,
    color: COLORS.text,
    minHeight: 42,
  },

  rating: {
    marginTop: 8,
    fontSize: 14,
    color: '#F59E0B',
  },

  price: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  button: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },

});

export default ProductCard;