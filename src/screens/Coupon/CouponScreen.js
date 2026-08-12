import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import api from '../../api/api';
import COLORS from '../../theme/colors';

const CouponScreen = ({ navigation, route }) => {
  const { orderTotal, onApply } = route.params || {};

  const [code, setCode] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get('/coupons')
      .then((res) => setCoupons(res.data.coupons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApply = (couponCode) => {
    const applyCode = couponCode || code.trim();
    if (!applyCode) {
      Alert.alert('Enter Code', 'Please enter a coupon code');
      return;
    }
    setApplying(true);
    api.post('/coupons/apply', { code: applyCode, orderTotal })
      .then((res) => {
        onApply && onApply({
          code: res.data.coupon.code,
          discount: res.data.discount,
          finalTotal: res.data.finalTotal,
          description: res.data.coupon.description,
        });
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert(
          'Invalid Coupon',
          err.response?.data?.message || 'Could not apply coupon'
        );
      })
      .finally(() => setApplying(false));
  };

  const renderCoupon = ({ item }) => {
    const eligible = orderTotal >= item.minOrderAmount;
    return (
      <View style={[styles.couponCard, !eligible && styles.couponCardDisabled]}>
        {/* Left dashed border effect */}
        <View style={styles.couponLeft}>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{item.code}</Text>
          </View>
          <View style={styles.discountRow}>
            <Ionicons name="pricetag-outline" size={14} color={eligible ? COLORS.primary : COLORS.textLight} />
            <Text style={[styles.discountLabel, !eligible && styles.disabledText]}>
              {item.discountType === 'percentage'
                ? `${item.discountValue}% OFF${item.maxDiscount ? ` (max ₹${item.maxDiscount})` : ''}`
                : `₹${item.discountValue} OFF`}
            </Text>
          </View>
          <Text style={[styles.couponDesc, !eligible && styles.disabledText]}>{item.description}</Text>
          {item.minOrderAmount > 0 && (
            <Text style={styles.minOrder}>Min. order: ₹{item.minOrderAmount}</Text>
          )}
          {!eligible && (
            <Text style={styles.notEligible}>
              Add ₹{item.minOrderAmount - orderTotal} more to use this
            </Text>
          )}
        </View>

        {/* Right apply button */}
        <TouchableOpacity
          style={[styles.applyBtn, !eligible && styles.applyBtnDisabled]}
          onPress={() => eligible && handleApply(item.code)}
          disabled={!eligible}
          activeOpacity={0.8}
        >
          <Text style={[styles.applyBtnText, !eligible && styles.applyBtnTextDisabled]}>
            {eligible ? 'Apply' : 'N/A'}
          </Text>
        </TouchableOpacity>

        {/* Dashed separator */}
        <View style={styles.dashedLine} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coupons & Offers</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Manual code entry */}
      <View style={styles.inputSection}>
        <View style={styles.inputWrap}>
          <Ionicons name="ticket-outline" size={18} color={COLORS.textLight} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter coupon code"
            placeholderTextColor={COLORS.textLight}
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            autoCapitalize="characters"
            returnKeyType="done"
            onSubmitEditing={() => handleApply()}
          />
          {code.length > 0 && (
            <TouchableOpacity onPress={() => setCode('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.checkBtn, applying && styles.checkBtnDisabled]}
          onPress={() => handleApply()}
          disabled={applying}
          activeOpacity={0.85}
        >
          {applying
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.checkBtnText}>Check</Text>}
        </TouchableOpacity>
      </View>

      {/* Order total info */}
      <View style={styles.totalBanner}>
        <Ionicons name="cart-outline" size={16} color={COLORS.primary} />
        <Text style={styles.totalBannerText}>
          Order total: <Text style={styles.totalBannerAmount}>₹{orderTotal?.toLocaleString()}</Text>
        </Text>
      </View>

      {/* Available coupons */}
      <Text style={styles.sectionTitle}>Available Coupons</Text>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item._id}
          renderItem={renderCoupon}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="ticket-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>No coupons available right now</Text>
            </View>
          }
        />
      )}
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

  // Code input
  inputSection: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, gap: 10, marginBottom: 12,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 14,
    paddingHorizontal: 14, height: 52,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, fontSize: 15, fontWeight: '700',
    color: COLORS.text, paddingVertical: 0,
    includeFontPadding: false, letterSpacing: 1,
  },
  checkBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingHorizontal: 20, height: 52,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOpacity: 0.35,
    shadowRadius: 8, elevation: 6,
  },
  checkBtnDisabled: { opacity: 0.65 },
  checkBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },

  // Total banner
  totalBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: COLORS.primaryLight, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  totalBannerText: { fontSize: 13, color: COLORS.textSecondary },
  totalBannerAmount: { fontWeight: '800', color: COLORS.primary },

  sectionTitle: {
    fontSize: 15, fontWeight: '800', color: COLORS.text,
    marginHorizontal: 20, marginBottom: 12,
  },

  // List
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  couponCard: {
    backgroundColor: COLORS.white, borderRadius: 18,
    marginBottom: 14, padding: 18, flexDirection: 'row',
    alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
    position: 'relative', overflow: 'hidden',
  },
  couponCardDisabled: { opacity: 0.6 },
  couponLeft: { flex: 1 },
  codeBox: {
    alignSelf: 'flex-start', backgroundColor: COLORS.primaryLight,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderStyle: 'dashed', marginBottom: 8,
  },
  codeText: { fontSize: 15, fontWeight: '800', color: COLORS.primary, letterSpacing: 1.5 },
  discountRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  discountLabel: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  couponDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 4 },
  minOrder: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  notEligible: { fontSize: 11, color: COLORS.danger, marginTop: 4, fontWeight: '600' },
  disabledText: { color: COLORS.textLight },
  applyBtn: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
    shadowColor: COLORS.primary, shadowOpacity: 0.3,
    shadowRadius: 6, elevation: 4,
  },
  applyBtnDisabled: { backgroundColor: COLORS.border },
  applyBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  applyBtnTextDisabled: { color: COLORS.textLight },
  dashedLine: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    height: 3, backgroundColor: COLORS.background,
  },

  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
  empty: { alignItems: 'center', paddingTop: 40, gap: 10 },
  emptyText: { fontSize: 14, color: COLORS.textLight },
});

export default CouponScreen;
