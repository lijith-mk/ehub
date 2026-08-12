import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const logoScale   = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity   = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(30)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const circleScale1 = useRef(new Animated.Value(0)).current;
  const circleScale2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background circles
    Animated.parallel([
      Animated.spring(circleScale1, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.spring(circleScale2, { toValue: 1, tension: 15, friction: 7, delay: 200, useNativeDriver: true }),
    ]).start();

    // Logo
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();

    // Title
    Animated.sequence([
      Animated.delay(700),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(titleTranslate, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();

    // Tagline
    Animated.sequence([
      Animated.delay(1000),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Decide where to go after splash
    const timer = setTimeout(() => {
      Promise.all([
        AsyncStorage.getItem('onboarding_done'),
        AsyncStorage.getItem('token'),
      ])
        .then(([onboardingDone, token]) => {
          if (!onboardingDone) {
            navigation.replace('Onboarding');
          } else if (token) {
            navigation.replace('Main');
          } else {
            navigation.replace('Login');
          }
        })
        .catch(() => {
          navigation.replace('Onboarding');
        });
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#6C63FF" barStyle="light-content" />
      <View style={styles.container}>

        <Animated.View style={[styles.bgCircle1, { transform: [{ scale: circleScale1 }] }]} />
        <Animated.View style={[styles.bgCircle2, { transform: [{ scale: circleScale2 }] }]} />

        <Animated.View style={[styles.logoWrapper, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] }]}>
          Ehub
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Everything You Need, One Hub.
        </Animated.Text>

        <Animated.View style={[styles.dotsRow, { opacity: taglineOpacity }]}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 0.9, height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -width * 0.2, right: -width * 0.2,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.7, height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -width * 0.1, left: -width * 0.15,
  },
  logoWrapper: { marginBottom: 28 },
  logoOuter: {
    width: 110, height: 110, borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  logoInner: {
    width: 84, height: 84, borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
  },
  logoLetter: { fontSize: 46, fontWeight: '800', color: '#6C63FF', letterSpacing: -1 },
  title: { fontSize: 42, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1, marginBottom: 10 },
  tagline: { fontSize: 15, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.5, marginBottom: 50 },
  dotsRow: {
    position: 'absolute', bottom: 50,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.35)' },
  dotActive: { width: 24, backgroundColor: '#FFFFFF', borderRadius: 4 },
});

export default SplashScreen;
