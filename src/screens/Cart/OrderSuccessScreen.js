import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../../theme/colors';

const OrderSuccessScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 60, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.bgCircle} />

      <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconOuter}>
          <View style={styles.iconInner}>
            <Ionicons name="checkmark" size={50} color="#fff" />
          </View>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: 'center' }}>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with Ehub.{'\n'}Your order is being processed.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>Estimated delivery: 3-5 business days</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>You'll receive updates via notifications</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
  },
  bgCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primaryLight,
    top: -120,
    alignSelf: 'center',
  },
  iconWrap: {
    marginBottom: 32,
  },
  iconOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(108,99,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    width: '100%',
    marginBottom: 28,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 50,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OrderSuccessScreen;
