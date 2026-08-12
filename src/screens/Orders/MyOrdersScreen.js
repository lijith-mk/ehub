import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import api from '../../api/api';
import COLORS from '../../theme/colors';

const STATUS_META = {
  Pending:    { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline' },
  Processing: { color: '#6C63FF', bg: '#EEF0FF', icon: 'refresh-outline' },
  Shipped:    { color: '#0EA5E9', bg: '#E0F2FE', icon: 'airplane-outline' },
  Delivered:  { color: '#22C55E', bg: '#DCFCE7', icon: 'checkmark-circle-outline' },
  Cancelled:  { color: '#EF4444', bg: '#FEE2E2', icon: 'close-circle-outline' },
};

const OrderCard = ({ order, onPress }) => {
  const meta = STATUS_META[order.status] || STATUS_META.Pending;
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon} size={13} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBottom}>
        <View style={styles.itemsInfo}>
          <Ionicons name="bag-outline" size={15} color={COLORS.textLight} />
          <Text style={styles.itemCount}>
            {order.products?.length || 0} item{order.products?.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={styles.total}>₹{order.totalPrice?.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (e) {
      // silently fail — could show empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => navigation.navigate('OrderDetail', { order: item })}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchOrders(true); }}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bag-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate('Main')}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  list: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 8 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  orderDate: { fontSize: 12, color: COLORS.textLight, marginTop: 3 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemsInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemCount: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  total: { fontSize: 17, fontWeight: '800', color: COLORS.primary },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: {
    width: 90, height: 90, borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center' },
  shopBtn: {
    marginTop: 16, backgroundColor: COLORS.primary,
    paddingHorizontal: 28, paddingVertical: 13, borderRadius: 14,
  },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default MyOrdersScreen;
