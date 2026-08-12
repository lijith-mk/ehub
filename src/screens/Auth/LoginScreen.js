import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import COLORS from '../../theme/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      navigation.replace('Main');
    } catch (error) {
      const msg =
        error.code === 'ECONNABORTED'
          ? 'Connection timed out. Make sure the server is running.'
          : error.response?.data?.message || 'Could not connect to server. Check your network.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Fixed decorative background — not inside scroll */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

            <View style={styles.logoMark}>
              <Text style={styles.logoLetter}>E</Text>
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue shopping</Text>

            <View style={styles.form}>
              <CustomInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon="mail-outline"
              />
              <CustomInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock-closed-outline"
              />

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <CustomButton
                title={loading ? 'Signing In...' : 'Sign In'}
                onPress={handleLogin}
                disabled={loading}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.linkText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

          </Animated.View>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  decorCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primaryLight,
    top: -100,
    right: -60,
    zIndex: 0,
  },
  decorCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(108,99,255,0.06)',
    top: 80,
    right: 110,
    zIndex: 0,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logoLetter: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 6,
    marginBottom: 10,
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 4,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: COLORS.textLight,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default LoginScreen;
