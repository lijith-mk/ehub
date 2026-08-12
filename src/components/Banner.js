import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import COLORS from '../theme/colors';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

const banners = [
  {
    id: '1',
    tag: '🔥 Limited Time',
    title: 'Summer Sale',
    subtitle: 'Up to 50% OFF on selected items',
    bg: ['#6C63FF', '#8B5CF6'],
    btnColor: '#fff',
    btnText: COLORS.primary,
  },
  {
    id: '2',
    tag: '✨ New Arrivals',
    title: 'Fresh Drops',
    subtitle: 'Check out the latest trending products',
    bg: ['#FF6584', '#FF8FA3'],
    btnColor: '#fff',
    btnText: '#FF6584',
  },
  {
    id: '3',
    tag: '🛡️ Free Delivery',
    title: 'Orders Above ₹499',
    subtitle: 'Shop more, save more on every order',
    bg: ['#059669', '#10B981'],
    btnColor: '#fff',
    btnText: '#059669',
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % banners.length;
      try {
        flatRef.current?.scrollToIndex({ index: next, animated: true });
      } catch (_) {}
      setActiveIndex(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const renderBanner = ({ item }) => (
    <View style={[styles.banner, { backgroundColor: item.bg[0] }]}>
      <View style={styles.bannerDecor} />
      <Text style={styles.bannerTag}>{item.tag}</Text>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
      <TouchableOpacity style={[styles.bannerBtn, { backgroundColor: item.btnColor }]}>
        <Text style={[styles.bannerBtnText, { color: item.btnText }]}>Shop Now →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: BANNER_WIDTH + 12,
          offset: (BANNER_WIDTH + 12) * index,
          index,
        })}
      />
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  banner: {
    width: BANNER_WIDTH,
    borderRadius: 20,
    padding: 22,
    overflow: 'hidden',
    minHeight: 150,
    justifyContent: 'center',
  },
  bannerDecor: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
    right: -40,
    top: -40,
  },
  bannerTag: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
    lineHeight: 18,
  },
  bannerBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
  },
  bannerBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});

export default Banner;
