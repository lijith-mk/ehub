import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, StatusBar, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import api from '../../api/api';
import COLORS from '../../theme/colors';

const { width } = Dimensions.get('window');

// Flash sale ends X hours from now — in real app this comes from backend
const SALE_END = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

// Simulated deal data — in production add a `dealPrice` & `stock` field to products
const DEAL_OVERRIDES = {
  0: { discount: 45, stock: 100, sold: 78 },
  1: { discount: 30, stock: 50,  sold: 31 },
  2: { discount: 60, stock: 200, sold: 164 },
  3: { discount: 25, stock: 80,  sold: 42 },
  4: { discount: 50, stock: 150, sold: 120 },
  5: { discount: 35, stock: 60,  sold: 28 },
};

// --- Countdown Timer Component ---
const CountdownTimer = ({ endTime }) => {
  const calcTime = () => {
    const diff = Math.max(0, endTime - Date.now());
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [time, setTime] = useState(calcTime());
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const tick = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
  }, [time.s]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <Animated.View style={[styles.timerRow, { transform: [{ scale: pulse }] }]}>
      {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
        <React.Fragment key={i}>
          <View style={styles.timerBlock}>
            <Text style={styles.timerNum}>{val}</Text>
          </View>
          {i < 2 && <Text style={styles.timerColon}>:</Text>}
        </React.Fragment>
      ))}
    </Animated.View>
  );
};

// --- Claimed Progress Bar ---
const ClaimedBar = ({ sold, stock }) => {
  const pct = Math.min((sold / stock) * 100, 100);
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, []);

  const barColor = pct > 70 ? '#EF4444' : pct > 40 ? '#F59E0B' : COLORS.success;

  return (
    <View style={styles.claimedWrap}>
      <View style={styles.claimedTrack}>
        <Animated.View
          style={[
            styles.claimedFill,
            {
              width: barAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
      <Text style={[styles.claimedText, { color: barColor }]}>
        {pct >= 100 ? 'Sold Out' : `${Math.round(pct)}% claimed`}
      </Text>
    </View>
  );
};

// --- Flash Badge ---
const FlashBadge = ({ discount }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.flashBadge, { opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }]}>
      <Ionicons name="flash" size={11} color="#fff" />
      <Text style={styles.flashBadgeText}>{discount}% OFF</Text>
    </Animated.View>
  );
};

// --- Deal Card ---
const DealCard = ({ item, deal, index, navigation, onAddToCart }) => {
  const salePrice = Math.round(item.price * (1 - deal.discount / 100));
  const soldOut = deal.sold >= deal.stock;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <FlashBadge discount={deal.discount} />
        {soldOut && (
          <View style={styles.soldOutOverlay}>
            <Text style={styles.soldOutText}>SOLD OUT</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>₹{salePrice.toLocaleString()}</Text>
          <Text style={styles.originalPrice}>₹{item.price?.toLocaleString()}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color="#F59E0B" />
          <Text style={styles.ratingText}>{item.rating || '4.0'}</Text>
        </View>

        <ClaimedBar sold={deal.sold} stock={deal.stock} />

        <TouchableOpacity
          style={[styles.addBtn, soldOut && styles.addBtnDisabled]}
          onPress={() => !soldOut && onAddToCart(item)}
          disabled={soldOut}
          activeOpacity={0.85}
        >
          <Ionicons
            name={soldOut ? 'close-circle-outline' : 'cart-outline'}
            size={15}
            color="#fff"
          />
          <Text style={styles.addBtnText}>
            {soldOut ? 'Sold Out' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// --- Main Screen ---
const FlashSaleScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    api.get('/products?limit=12')
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    Animated.timing(headerAnim, {
      toValue: 1, duration: 700, useNativeDriver: true,
    }).start();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
  };

  const deals = products.map((p, i) => ({
    ...p,
    deal: DEAL_OVERRIDES[i % Object.keys(DEAL_OVERRIDES).length],
  }));

  const renderDeal = ({ item, index }) => (
    <DealCard
      item={item}
      deal={item.deal}
      index={index}
      navigation={navigation}
      onAddToCart={handleAddToCart}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF2D55" barStyle="light-content" />

      {/* Animated header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{
              translateY: headerAnim.interpolate({
                inputRange: [0, 1], outputRange: [-30, 0],
              }),
            }],
          },
        ]}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerInner}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={styles.flashIconRow}>
                <Ionicons name="flash" size={22} color="#FFD700" />
                <Text style={styles.headerTitle}>Flash Sale</Text>
                <Ionicons name="flash" size={22} color="#FFD700" />
              </View>
              <Text style={styles.headerSub}>Ends in</Text>
              <CountdownTimer endTime={SALE_END} />
            </View>

            <View style={{ width: 44 }} />
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Deals grid */}
      <FlatList
        data={deals}
        keyExtractor={(item) => item._id}
        renderItem={renderDeal}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.subHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE NOW</Text>
            </View>
            <Text style={styles.dealsCount}>{deals.length} deals available</Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="flash-outline" size={52} color={COLORS.border} />
              <Text style={styles.emptyText}>No deals right now</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    backgroundColor: '#FF2D55',
    paddingBottom: 16,
    shadowColor: '#FF2D55',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  headerInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { alignItems: 'center', flex: 1 },
  flashIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 6, fontWeight: '500' },

  // Timer
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerBlock: {
    backgroundColor: '#1A1A2E', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, minWidth: 44, alignItems: 'center',
  },
  timerNum: { fontSize: 20, fontWeight: '900', color: '#fff', fontVariant: ['tabular-nums'] },
  timerColon: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 2 },

  // Sub header
  subHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFF0F3', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF2D55',
  },
  liveText: { fontSize: 11, fontWeight: '800', color: '#FF2D55', letterSpacing: 1 },
  dealsCount: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  // Grid
  list: { paddingHorizontal: 8, paddingBottom: 30 },
  row: { paddingHorizontal: 4 },

  // Deal card
  card: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 18,
    margin: 6, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
  },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 150, resizeMode: 'cover', backgroundColor: COLORS.inputBg },

  // Flash badge
  flashBadge: {
    position: 'absolute', top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FF2D55', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  flashBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },

  // Sold out overlay
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center',
  },
  soldOutText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1.5 },

  // Card info
  info: { padding: 12 },
  category: {
    fontSize: 9, fontWeight: '700', color: COLORS.textLight,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3,
  },
  name: {
    fontSize: 13, fontWeight: '700', color: COLORS.text,
    lineHeight: 18, marginBottom: 8, minHeight: 36,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  salePrice: { fontSize: 17, fontWeight: '900', color: '#FF2D55' },
  originalPrice: {
    fontSize: 12, color: COLORS.textLight,
    textDecorationLine: 'line-through', fontWeight: '500',
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 8 },
  ratingText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },

  // Claimed bar
  claimedWrap: { marginBottom: 10 },
  claimedTrack: {
    height: 5, backgroundColor: COLORS.border, borderRadius: 3,
    overflow: 'hidden', marginBottom: 4,
  },
  claimedFill: { height: 5, borderRadius: 3 },
  claimedText: { fontSize: 10, fontWeight: '700' },

  // Add button
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, backgroundColor: '#FF2D55', borderRadius: 10,
    paddingVertical: 9,
    shadowColor: '#FF2D55', shadowOpacity: 0.35, shadowRadius: 6, elevation: 4,
  },
  addBtnDisabled: { backgroundColor: COLORS.border },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 15, color: COLORS.textLight },
});

export default FlashSaleScreen;
