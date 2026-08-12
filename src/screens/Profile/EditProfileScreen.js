import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import COLORS from '../../theme/colors';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((data) => {
        if (data) {
          const u = JSON.parse(data);
          setName(u.name || '');
          setEmail(u.email || '');
          setPhone(u.phone || '');
          setAddress(u.address || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    if (!name || !email) {
      Alert.alert('Required', 'Name and email are required');
      return;
    }
    setLoading(true);
    AsyncStorage.getItem('user')
      .then((raw) => {
        const existing = raw ? JSON.parse(raw) : {};
        const updated = { ...existing, name, email, phone, address };
        return AsyncStorage.setItem('user', JSON.stringify(updated));
      })
      .then(() => {
        Alert.alert('Saved', 'Profile updated successfully');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to update profile');
      })
      .finally(() => setLoading(false));
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={styles.saveBtn}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera-outline" size={16} color={COLORS.primary} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Personal Info</Text>
          <CustomInput placeholder="Full Name" value={name} onChangeText={setName} icon="person-outline" />
          <CustomInput placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" icon="mail-outline" />
          <CustomInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Delivery Info</Text>
          <CustomInput placeholder="Default Address" value={address} onChangeText={setAddress} icon="location-outline" />
        </View>

        <TouchableOpacity
          style={[styles.saveFullBtn, loading && { opacity: 0.65 }]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.saveFullBtnText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  saveBtn: { fontSize: 15, color: COLORS.primary, fontWeight: '700' },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 90, height: 90, borderRadius: 28, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  changePhotoText: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  formSection: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: COLORS.textLight,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4, marginLeft: 4,
  },
  saveFullBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center', marginTop: 10,
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  saveFullBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default EditProfileScreen;
