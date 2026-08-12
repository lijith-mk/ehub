import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../theme/colors';

const ProductCard = ({ item, onPress, onAddToCart }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {/* Image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.discount && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.discount}%</Text>
          </View>
        )}
        <TouchableOpacity style={styles.wishlist}>
          <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onAddToCart && onAddToCart(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 145,
    resizeMode: 'cover',
    backgroundColor: COLORS.inputBg,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  wishlist: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  category: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  rating: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
});

export default ProductCard;
