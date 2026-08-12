import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import COLORS from '../../theme/colors';

const { width } = Dimensions.get('window');

// --- Star Rating Row ---
const StarRow = ({ rating }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {stars.map((s) => (
        <Ionicons
          key={s}
          name={s <= Math.round(rating) ? 'star' : 'star-outline'}
          size={14}
          color="#F59E0B"
        />
      ))}
    </View>
  );
};

// --- Rating Bar ---
const RatingBar = ({ label, value, total }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  const color =
    label >= 4 ? '#22C55E' : label >= 3 ? '#F59E0B' : '#EF4444';
  return (
    <View style={rStyle.row}>
      <Text style={rStyle.label}>{label}</Text>
      <Ionicons name="star" size={11} color={color} />
      <View style={rStyle.track}>
        <View style={[rStyle.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={rStyle.count}>{value}</Text>
    </View>
  );
};
const rStyle = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  label: { fontSize: 12, color: COLORS.textSecondary, width: 10 },
  track: { flex: 1, height: 5, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
  count: { fontSize: 12, color: COLORS.textSecondary, width: 28, textAlign: 'right' },
});

// Dummy highlights based on category
const getHighlights = (category) => {
  const map = {
    Mobiles: ['6.7" AMOLED Display', '5000mAh Battery', '128GB Storage', '50MP Camera'],
    Laptop:  ['Intel Core i5 12th Gen', '16GB RAM', '512GB SSD', 'Windows 11 Home'],
    Shoes:   ['Genuine Leather Upper', 'Memory Foam Insole', 'Anti-slip Outsole', 'Breathable Mesh'],
    Watch:   ['Always-on Display', 'Heart Rate Monitor', '7-day Battery', 'Water Resistant 5ATM'],
    Audio:   ['Active Noise Cancellation', '30hr Playback', 'Bluetooth 5.3', 'Foldable Design'],
  };
  return map[category] || ['Premium Quality', 'Free Delivery', 'Easy Returns', '1 Year Warranty'];
};

const OFFERS = [
  { icon: 'card-outline',     color: '#6C63FF', text: 'Bank Offer: 10% off on HDFC Credit Card' },
  { icon: 'pricetag-outline', color: '#22C55E', text: 'Special Price: Extra ₹200 off above ₹999' },
  { icon: 'refresh-outline',  color: '#0EA5E9', text: 'No Cost EMI from ₹499/month' },
];

const MOCK_REVIEWS = [
  { id: '1', user: 'Rahul M.',    rating: 5, text: 'Absolutely love this product. Build quality is excellent and delivery was super fast!', date: '2 days ago' },
  { id: '2', user: 'Priya S.',    rating: 4, text: 'Great value for money. Looks exactly like the photos. Would recommend.', date: '1 week ago' },
  { id: '3', user: 'Arun K.',     rating: 3, text: 'Decent product but packaging could be better. Works as expected.', date: '2 weeks ago' },
];

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useContext(CartContext);
  const { isWishlisted, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const wishlisted = isWishlisted(product._id);
  const [activeImg, setActiveImg] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fake image gallery from single image
  const images = [product.image, product.image, product.image];

  const mrp = Math.round(product.price * 1.3);
  const discount = Math.round(((mrp - product.price) / mrp) * 100);
  const highlights = getHighlights(product.category);
  const inStock = product.stock === undefined || product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, 1);
    Alert.alert('Added to Cart', `${product.name} added to your cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigation.navigate('Checkout', { total: product.price });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)}
          >
            <Ionicons
              name={wishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={wishlisted ? COLORS.accent : COLORS.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* Image Gallery */}
        <View style={styles.galleryWrap}>
          <FlatList
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImg(idx);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.heroImage} />
            )}
          />
          {/* Dots */}
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, activeImg === i && styles.dotActive]} />
            ))}
          </View>
          {/* Discount badge */}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.content}>

          {/* Brand / Category */}
          <Text style={styles.brand}>{product.category?.toUpperCase()}</Text>

          {/* Product Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating Summary */}
          <TouchableOpacity style={styles.ratingRow} activeOpacity={0.8}>
            <StarRow rating={product.rating || 4} />
            <Text style={styles.ratingVal}>{product.rating || '4.0'}</Text>
            <Text style={styles.ratingCount}>(128 ratings)</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.textLight} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Price Block */}
          <View style={styles.priceBlock}>
            <Text style={styles.price}>₹{product.price?.toLocaleString()}</Text>
            <Text style={styles.mrp}>₹{mrp.toLocaleString()}</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>{discount}% off</Text>
            </View>
          </View>
          <Text style={styles.taxNote}>Inclusive of all taxes</Text>

          {/* Stock status */}
          <View style={styles.stockRow}>
            <View style={[styles.stockDot, { backgroundColor: inStock ? COLORS.success : COLORS.danger }]} />
            <Text style={[styles.stockText, { color: inStock ? COLORS.success : COLORS.danger }]}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Offers */}
          <Text style={styles.sectionTitle}>Available Offers</Text>
          {OFFERS.map((offer, i) => (
            <View key={i} style={styles.offerRow}>
              <View style={[styles.offerIcon, { backgroundColor: offer.color + '18' }]}>
                <Ionicons name={offer.icon} size={16} color={offer.color} />
              </View>
              <Text style={styles.offerText}>{offer.text}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Delivery Info */}
          <Text style={styles.sectionTitle}>Delivery & Services</Text>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryRow}>
              <Ionicons name="bicycle-outline" size={20} color={COLORS.primary} />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>Free Delivery</Text>
                <Text style={styles.deliverySubtitle}>Delivery by {getDeliveryDate()}</Text>
              </View>
              <Text style={styles.deliveryFree}>FREE</Text>
            </View>
            <View style={styles.deliveryDivider} />
            <View style={styles.deliveryRow}>
              <Ionicons name="return-up-back-outline" size={20} color={COLORS.success} />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>7 Days Return</Text>
                <Text style={styles.deliverySubtitle}>Easy hassle-free returns</Text>
              </View>
            </View>
            <View style={styles.deliveryDivider} />
            <View style={styles.deliveryRow}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0EA5E9" />
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryTitle}>1 Year Warranty</Text>
                <Text style={styles.deliverySubtitle}>Brand warranty included</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Highlights */}
          <Text style={styles.sectionTitle}>Product Highlights</Text>
          <View style={styles.highlightsCard}>
            {highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightDot} />
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>About this Product</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          {/* Ratings & Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Rating Overview */}
          <View style={styles.ratingOverview}>
            <View style={styles.ratingBig}>
              <Text style={styles.ratingBigNum}>{product.rating || '4.0'}</Text>
              <StarRow rating={product.rating || 4} />
              <Text style={styles.ratingBigCount}>128 ratings</Text>
            </View>
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((n) => (
                <RatingBar
                  key={n}
                  label={n}
                  value={n === 5 ? 64 : n === 4 ? 32 : n === 3 ? 16 : n === 2 ? 10 : 6}
                  total={128}
                />
              ))}
            </View>
          </View>

          {/* Review Cards */}
          {(showAllReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 2)).map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.user[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewUser}>{r.user}</Text>
                  <StarRow rating={r.rating} />
                </View>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}

          {!showAllReviews && (
            <TouchableOpacity
              style={styles.showMoreBtn}
              onPress={() => setShowAllReviews(true)}
            >
              <Text style={styles.showMoreText}>View all reviews</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}

          {/* Spacer for sticky footer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.stickyBar}>
        <TouchableOpacity
          style={styles.wishBtn}
          onPress={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product)}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={wishlisted ? COLORS.accent : COLORS.textSecondary}
          />
          <Text style={[styles.wishBtnText, wishlisted && { color: COLORS.accent }]}>
            {wishlisted ? 'Wishlisted' : 'Wishlist'}
          </Text>
        </TouchableOpacity>

        <View style={styles.barDivider} />

        <TouchableOpacity
          style={styles.cartBarBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          disabled={!inStock}
        >
          <Ionicons name="cart-outline" size={19} color={COLORS.primary} />
          <Text style={styles.cartBarBtnText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buyBtn, !inStock && styles.buyBtnDisabled]}
          onPress={handleBuyNow}
          activeOpacity={0.85}
          disabled={!inStock}
        >
          <Text style={styles.buyBtnText}>{inStock ? 'Buy Now' : 'Out of Stock'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Floating header
  floatingHeader: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerRight: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },

  // Gallery
  galleryWrap: { position: 'relative', backgroundColor: '#F8F8FC' },
  heroImage: { width, height: 360, resizeMode: 'contain', backgroundColor: '#F8F8FC' },
  dots: {
    flexDirection: 'row', justifyContent: 'center', gap: 6,
    position: 'absolute', bottom: 14, left: 0, right: 0,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive: { width: 20, backgroundColor: COLORS.primary },
  discountBadge: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: COLORS.accent, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  discountBadgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  // Content card
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    marginTop: -20, paddingHorizontal: 20, paddingTop: 20,
  },

  brand: {
    fontSize: 11, fontWeight: '700', color: COLORS.primary,
    letterSpacing: 1.2, marginBottom: 6,
  },
  name: {
    fontSize: 18, fontWeight: '700', color: COLORS.text,
    lineHeight: 26, marginBottom: 10,
  },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  ratingVal: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  ratingCount: { fontSize: 13, color: COLORS.textLight },

  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 18 },

  // Price
  priceBlock: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  price: { fontSize: 26, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  mrp: { fontSize: 16, color: COLORS.textLight, textDecorationLine: 'line-through' },
  saveBadge: {
    backgroundColor: '#DCFCE7', paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 6,
  },
  saveText: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  taxNote: { fontSize: 12, color: COLORS.textLight, marginBottom: 10 },

  // Stock
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stockDot: { width: 8, height: 8, borderRadius: 4 },
  stockText: { fontSize: 13, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },

  // Offers
  offerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  offerIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  offerText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },

  // Delivery
  deliveryCard: {
    backgroundColor: COLORS.background, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  deliveryInfo: { flex: 1 },
  deliveryTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  deliverySubtitle: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  deliveryFree: { fontSize: 13, fontWeight: '700', color: COLORS.success },
  deliveryDivider: { height: 1, backgroundColor: COLORS.border },

  // Highlights
  highlightsCard: {
    backgroundColor: COLORS.background, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  highlightRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  highlightDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 7 },
  highlightText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },

  // Description
  description: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },

  // Reviews
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  seeAllText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  ratingOverview: { flexDirection: 'row', gap: 20, marginBottom: 16, alignItems: 'flex-start' },
  ratingBig: { alignItems: 'center', gap: 6, minWidth: 80 },
  ratingBigNum: { fontSize: 42, fontWeight: '800', color: COLORS.text, lineHeight: 48 },
  ratingBigCount: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  ratingBars: { flex: 1 },

  reviewCard: {
    backgroundColor: COLORS.background, borderRadius: 16,
    padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  reviewAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  reviewUser: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  reviewDate: { fontSize: 11, color: COLORS.textLight },
  reviewText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  showMoreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 12,
    borderWidth: 1, borderColor: COLORS.primary, borderRadius: 12,
  },
  showMoreText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },

  // Sticky Bottom Bar
  stickyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 20,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 }, elevation: 16,
  },
  wishBtn: { alignItems: 'center', paddingHorizontal: 12, gap: 3 },
  wishBtnText: { fontSize: 10, color: COLORS.textSecondary, fontWeight: '600' },
  barDivider: { width: 1, height: 36, backgroundColor: COLORS.border, marginHorizontal: 4 },
  cartBarBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 50, borderRadius: 14, marginHorizontal: 8,
    borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight,
  },
  cartBarBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  buyBtn: {
    flex: 1, height: 50, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  buyBtnDisabled: { backgroundColor: COLORS.border },
  buyBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default ProductDetailsScreen;
