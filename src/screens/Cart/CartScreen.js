import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CartContext } from '../../context/CartContext';
import COLORS from '../../theme/colors';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>₹{(item.price * item.quantity).toLocaleString()}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[styles.qtyBtn, item.quantity === 1 && styles.qtyBtnMuted]}
            onPress={() => decreaseQuantity(item._id)}
          >
            <Ionicons name="remove" size={16} color={item.quantity === 1 ? COLORS.textLight : COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQuantity(item._id)}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item._id)}>
        <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerCount}>{cartItems.length} items</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={72} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add items you love to start shopping</Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopBtnText}>Explore Products</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{total.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success }]}>
              {total >= 499 ? 'FREE' : '₹49'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ₹{(total >= 499 ? total : total + 49).toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate('Checkout', { total })}
            activeOpacity={0.85}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerCount: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 14,
    backgroundColor: COLORS.inputBg,
  },
  details: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 2,
  },
  category: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    padding: 3,
    alignSelf: 'flex-start',
    gap: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  qtyBtnMuted: {
    opacity: 0.4,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 28,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
    marginLeft: 4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  shopBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    marginTop: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CartScreen;
