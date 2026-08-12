import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { WishlistContext } from '../../context/WishlistContext';
import { CartContext } from '../../context/CartContext';
import COLORS from '../../theme/colors';

const WishlistScreen = ({ navigation }) => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.price}>₹{item.price?.toLocaleString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFromWishlist(item._id)}
        >
          <Ionicons name="heart" size={18} color={COLORS.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => {
            addToCart(item, 1);
            removeFromWishlist(item._id);
            navigation.navigate('Cart');
          }}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <Text style={styles.headerCount}>{wishlist.length} items</Text>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="heart-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptySubtitle}>Tap the heart on any product to save it here</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Main')}>
              <Text style={styles.shopBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  headerCount: { fontSize: 13, color: COLORS.textLight, fontWeight: '500' },
  list: { paddingHorizontal: 16, paddingBottom: 30, paddingTop: 4 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 18,
    marginBottom: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  image: { width: 100, height: 110, backgroundColor: COLORS.inputBg },
  info: { flex: 1, padding: 12 },
  category: { fontSize: 11, color: COLORS.textLight, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.4 },
  name: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 3, lineHeight: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  rating: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginTop: 6 },
  actions: { justifyContent: 'space-between', padding: 12 },
  removeBtn: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFF1F2',
    justifyContent: 'center', alignItems: 'center',
  },
  cartBtn: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: {
    width: 90, height: 90, borderRadius: 28, backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: 30 },
  shopBtn: {
    marginTop: 16, backgroundColor: COLORS.primary,
    paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14,
  },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default WishlistScreen;
