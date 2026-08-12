import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../../theme/colors';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    icon: 'bag-check-outline',
    iconBg: COLORS.primaryLight,
    iconColor: COLORS.primary,
    title: 'Order Confirmed',
    message: 'Your order #AB12C3 has been confirmed and is being processed.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    type: 'offer',
    icon: 'pricetag-outline',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    title: '🔥 Flash Sale Today!',
    message: 'Up to 60% off on Electronics. Limited time — grab the deal now!',
    time: '1 hr ago',
    unread: true,
  },
  {
    id: '3',
    type: 'delivery',
    icon: 'airplane-outline',
    iconBg: '#E0F2FE',
    iconColor: '#0EA5E9',
    title: 'Order Shipped',
    message: 'Your order is on the way. Expected delivery in 2-3 days.',
    time: '3 hrs ago',
    unread: false,
  },
  {
    id: '4',
    type: 'offer',
    icon: 'gift-outline',
    iconBg: '#FEE2E2',
    iconColor: '#EF4444',
    title: 'Special Offer for You',
    message: 'Use code EHUB20 to get flat 20% off on your next purchase.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '5',
    type: 'delivery',
    icon: 'checkmark-circle-outline',
    iconBg: '#DCFCE7',
    iconColor: '#22C55E',
    title: 'Order Delivered',
    message: 'Your order #XY789Z has been delivered. Hope you enjoy it!',
    time: '2 days ago',
    unread: false,
  },
  {
    id: '6',
    type: 'system',
    icon: 'star-outline',
    iconBg: COLORS.primaryLight,
    iconColor: COLORS.primary,
    title: 'Rate Your Purchase',
    message: 'How was your recent order? Leave a review and help others.',
    time: '3 days ago',
    unread: false,
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.unread && styles.cardUnread]}
      activeOpacity={0.8}
      onPress={() =>
        setNotifications(
          notifications.map((n) => n.id === item.id ? { ...n, unread: false } : n)
        )
      }
    >
      <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
        <Ionicons name={item.icon} size={22} color={item.iconColor} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 70 }} />
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
  markAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  unreadBanner: {
    marginHorizontal: 20, marginBottom: 8, paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: COLORS.primaryLight, borderRadius: 12,
  },
  unreadBannerText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: COLORS.white, borderRadius: 18, padding: 16,
    marginBottom: 10, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardUnread: {
    backgroundColor: '#FAFAFE',
    borderWidth: 1, borderColor: 'rgba(108,99,255,0.1)',
  },
  iconWrap: {
    width: 46, height: 46, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 },
  time: { fontSize: 11, color: COLORS.textLight, fontWeight: '500' },
  message: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
    position: 'absolute', top: 16, right: 16,
  },
});

export default NotificationsScreen;
