import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from '../../api/api';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import COLORS from '../../theme/colors';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/auth/register', { name, email, password, phone, address });
      Alert.alert('Account Created', response.data.message);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.logoMark}>
                <Text style={styles.logoLetter}>E</Text>
              </View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join Ehub and start shopping</Text>
            </View>

            <View style={styles.form}>
              <CustomInput placeholder="Full Name" value={name} onChangeText={setName} icon="person-outline" />
              <CustomInput placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" icon="mail-outline" />
              <CustomInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
              <CustomInput placeholder="Delivery Address" value={address} onChangeText={setAddress} icon="location-outline" />
              <CustomInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry icon="lock-closed-outline" />

              <CustomButton
                title={loading ? 'Creating Account...' : 'Create Account'}
                onPress={handleRegister}
                disabled={loading}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.linkText}>Sign In</Text>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  content: {
    flex: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.text,
    lineHeight: 26,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logoLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginTop: 6,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 10,
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

export default RegisterScreen;
