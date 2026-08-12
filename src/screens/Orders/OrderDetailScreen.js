import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../../theme/colors';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const STATUS_META = {
  Pending:    { color: '#F59E0B', bg: '#FEF3C7' },
  Processing: { color: '#6C63FF', bg: '#EEF0FF' },
  Shipped:    { color: '#0EA5E9', bg: '#E0F2FE' },
  Delivered:  { color: '#22C55E', bg: '#DCFCE7' },
  Cancelled:  { color: '#EF4444', bg: '#FEE2E2' },
};

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const meta = STATUS_META[order.status] || STATUS_META.Pending;
  const stepIndex = STATUS_STEPS.indexOf(order.status);

  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Order ID & Status */}
        <View style={styles.section}>
          <View style={styles.orderIdRow}>
            <View>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.orderId}>#{order._id.slice(-10).toUpperCase()}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: meta.bg }]}>
              <Text style={[styles.badgeText, { color: meta.color }]}>{order.status}</Text>
            </View>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>

        {/* Progress Tracker */}
        {order.status !== 'Cancelled' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Progress</Text>
            <View style={styles.tracker}>
              {STATUS_STEPS.map((step, i) => {
                const done = i <= stepIndex;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <View key={step} style={styles.stepRow}>
                    <View style={styles.stepLeft}>
                      <View style={[styles.stepDot, done && styles.stepDotActive]}>
                        {done && <Ionicons name="checkmark" size={12} color="#fff" />}
                      </View>
                      {!isLast && <View style={[styles.stepLine, done && styles.stepLineActive]} />}
                    </View>
                    <Text style={[styles.stepLabel, done && styles.stepLabelActive]}>{step}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.addressCard}>
              <Ionicons name="location" size={18} color={COLORS.primary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.addrName}>{order.deliveryAddress.name}</Text>
                <Text style={styles.addrText}>
                  {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                </Text>
                <Text style={styles.addrPhone}>{order.deliveryAddress.phone}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {(order.products || []).map((item, i) => (
            <View key={i} style={styles.productRow}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImg} />
              ) : (
                <View style={[styles.productImg, styles.productImgPlaceholder]}>
                  <Ionicons name="image-outline" size={22} color={COLORS.textLight} />
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name || 'Product'}</Text>
                <Text style={styles.productQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{order.totalPrice?.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>FREE</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>₹{order.totalPrice?.toLocaleString()}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  section: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 18,
    marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  orderIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  label: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  orderId: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  date: { fontSize: 13, color: COLORS.textSecondary },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  tracker: {},
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 0 },
  stepLeft: { alignItems: 'center', width: 24, marginRight: 14 },
  stepDot: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2,
    borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  stepDotActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepLine: { width: 2, height: 28, backgroundColor: COLORS.border, marginVertical: 2 },
  stepLineActive: { backgroundColor: COLORS.primary },
  stepLabel: { fontSize: 14, color: COLORS.textLight, fontWeight: '500', paddingTop: 4 },
  stepLabelActive: { color: COLORS.text, fontWeight: '700' },
  addressCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  addrName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  addrText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  addrPhone: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 3 },
  productRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14,
    paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  productImg: { width: 64, height: 64, borderRadius: 12, backgroundColor: COLORS.inputBg },
  productImgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  productInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  productQty: { fontSize: 12, color: COLORS.textLight },
  productPrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  summaryCard: {},
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12, marginTop: 4,
  },
  totalLabel: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
});

export default OrderDetailScreen;
