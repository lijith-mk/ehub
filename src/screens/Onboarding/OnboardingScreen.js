import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../../theme/colors';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'storefront-outline',
    iconBg: '#EEF0FF',
    iconColor: '#6C63FF',
    accent: '#6C63FF',
    title: 'Discover Amazing\nProducts',
    subtitle:
      'Browse thousands of products across all categories — electronics, fashion, home & more.',
    shape1: '#6C63FF',
    shape2: '#8B5CF6',
  },
  {
    id: '2',
    icon: 'flash-outline',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    accent: '#F59E0B',
    title: 'Exclusive Deals\nEvery Day',
    subtitle:
      'Flash sales, limited-time offers and special discounts waiting for you every single day.',
    shape1: '#F59E0B',
    shape2: '#FCD34D',
  },
  {
    id: '3',
    icon: 'rocket-outline',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    accent: '#22C55E',
    title: 'Fast & Secure\nDelivery',
    subtitle:
      'Get your orders delivered to your doorstep quickly, safely and with real-time tracking.',
    shape1: '#22C55E',
    shape2: '#86EFAC',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      try {
        flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      } catch (_) {}
    } else {
      finish();
    }
  };

  const finish = () => {
    AsyncStorage.setItem('onboarding_done', 'true')
      .then(() => navigation.replace('Login'))
      .catch(() => navigation.replace('Login'));
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const slide = SLIDES[currentIndex];

  const renderSlide = ({ item, index }) => (
    <View style={styles.slide}>
      {/* Background shapes */}
      <View style={[styles.shapeBig, { backgroundColor: item.shape1 + '14' }]} />
      <View style={[styles.shapeSmall, { backgroundColor: item.shape2 + '20' }]} />

      {/* Illustration area */}
      <View style={styles.illustrationWrap}>
        <View style={[styles.illustrationOuter, { borderColor: item.accent + '30' }]}>
          <View style={[styles.illustrationInner, { backgroundColor: item.iconBg }]}>

            {/* Central icon */}
            <Ionicons name={item.icon} size={72} color={item.iconColor} />

            {/* Floating mini badges */}
            <View style={[styles.floatBadge, styles.floatBadge1, { backgroundColor: item.accent }]}>
              <Ionicons name="checkmark" size={14} color="#fff" />
            </View>
            <View style={[styles.floatBadge, styles.floatBadge2, { backgroundColor: '#fff' }]}>
              <Ionicons name="star" size={12} color={item.accent} />
            </View>
            <View style={[styles.floatBadge, styles.floatBadge3, { backgroundColor: item.accent + '22' }]}>
              <Ionicons name="heart" size={12} color={item.accent} />
            </View>

          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Skip button */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={finish}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={renderSlide}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      {/* Bottom panel */}
      <View style={styles.bottomPanel}>

        {/* Text content — animated by index */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: slide.accent === '#F59E0B' ? '#92400E' : COLORS.text }]}>
            {SLIDES[currentIndex].title}
          </Text>
          <Text style={styles.subtitle}>{SLIDES[currentIndex].subtitle}</Text>
        </View>

        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: slide.accent,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: slide.accent }]}
          onPress={goNext}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            {currentIndex === SLIDES.length - 1 ? "Let's Shop" : 'Next'}
          </Text>
          <View style={styles.btnIconWrap}>
            <Ionicons
              name={currentIndex === SLIDES.length - 1 ? 'rocket-outline' : 'arrow-forward'}
              size={18}
              color={slide.accent}
            />
          </View>
        </TouchableOpacity>

        {/* Login link on last slide */}
        {currentIndex === SLIDES.length - 1 && (
          <TouchableOpacity style={styles.loginLink} onPress={finish}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <Text style={[styles.loginLinkBold, { color: slide.accent }]}>Sign In</Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  skipBtn: {
    position: 'absolute',
    top: 52,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
  },
  skipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },

  // Each slide takes full width, only the illustration lives here
  slide: {
    width,
    height: height * 0.52,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  shapeBig: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: width * 0.55,
    top: -width * 0.35,
    right: -width * 0.25,
  },
  shapeSmall: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    bottom: -width * 0.15,
    left: -width * 0.1,
  },

  illustrationWrap: { alignItems: 'center', justifyContent: 'center' },
  illustrationOuter: {
    width: 220,
    height: 220,
    borderRadius: 70,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationInner: {
    width: 180,
    height: 180,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // Floating accent badges
  floatBadge: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  floatBadge1: { top: -8, right: -8 },
  floatBadge2: { bottom: 8, right: -14 },
  floatBadge3: { top: 12, left: -14 },

  // Bottom panel
  bottomPanel: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  textBlock: { paddingTop: 8 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // Button
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: 18,
    gap: 12,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btnText: { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  btnIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Login link on last slide
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  loginLinkText: { fontSize: 14, color: COLORS.textSecondary },
  loginLinkBold: { fontSize: 14, fontWeight: '700' },
});

export default OnboardingScreen;
