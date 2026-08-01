import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../api/api';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password,
      });

      await AsyncStorage.setItem(
        'token',
        response.data.token,
      );

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(response.data.user),
      );

      Alert.alert('Success', response.data.message);

      navigation.replace('Main');

    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            Welcome Back 👋
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue shopping
          </Text>

          <CustomInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title={loading ? 'Logging In...' : 'Login'}
            onPress={handleLogin}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.registerText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 30,
  },

  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },

  forgotText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },

  footerText: {
    color: '#6B7280',
  },

  registerText: {
    color: '#2563EB',
    fontWeight: '700',
    marginLeft: 5,
  },
});

export default LoginScreen;