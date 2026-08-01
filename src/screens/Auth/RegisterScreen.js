import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';

import api from '../../api/api';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        phone,
        address,
      });

      Alert.alert('Success', response.data.message);

      navigation.goBack();

    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Register to start shopping
          </Text>

          <CustomInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />

          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <CustomInput
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
          />

          <CustomInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title={loading ? 'Creating Account...' : 'Register'}
            onPress={handleRegister}
          />

          <View style={styles.footer}>
            <Text>Already have an account?</Text>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.login}>
                Login
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
    fontWeight: 'bold',
    color: '#111827',
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 30,
    marginTop: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  login: {
    marginLeft: 5,
    color: '#2563EB',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;