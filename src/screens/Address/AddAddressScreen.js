import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import CustomInput from '../../components/CustomInput';
import { loadAddresses, saveAddresses } from './AddressBookScreen';
import COLORS from '../../theme/colors';

const LABELS = ['Home', 'Work', 'Other'];

const AddAddressScreen = ({ navigation, route }) => {
  const editingAddress = route.params?.address;
  const isEdit = !!editingAddress;

  const [label, setLabel] = useState(editingAddress?.label || 'Home');
  const [name, setName] = useState(editingAddress?.name || '');
  const [phone, setPhone] = useState(editingAddress?.phone || '');
  const [address, setAddress] = useState(editingAddress?.address || '');
  const [city, setCity] = useState(editingAddress?.city || '');
  const [pincode, setPincode] = useState(editingAddress?.pincode || '');
  const [isDefault, setIsDefault] = useState(editingAddress?.isDefault || false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name || !phone || !address || !city || !pincode) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }
    setSaving(true);
    loadAddresses().then((existing) => {
      let updated;
      const newEntry = {
        id: editingAddress?.id || Date.now().toString(),
        label, name, phone, address, city, pincode, isDefault,
      };

      if (isEdit) {
        updated = existing.map((a) => a.id === editingAddress.id ? newEntry : a);
      } else {
        updated = [...existing, newEntry];
      }

      // If this is set as default, unset others
      if (isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: a.id === newEntry.id }));
      }

      // If no default exists, set first one
      if (!updated.some((a) => a.isDefault) && updated.length > 0) {
        updated[0].isDefault = true;
      }

      return saveAddresses(updated);
    }).then(() => {
      navigation.goBack();
    }).catch(() => {
      Alert.alert('Error', 'Failed to save address');
    }).finally(() => setSaving(false));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Address' : 'Add New Address'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Label selector */}
        <Text style={styles.sectionLabel}>Address Type</Text>
        <View style={styles.labelRow}>
          {LABELS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.labelChip, label === l && styles.labelChipActive]}
              onPress={() => setLabel(l)}
            >
              <Ionicons
                name={l === 'Home' ? 'home-outline' : l === 'Work' ? 'briefcase-outline' : 'location-outline'}
                size={15}
                color={label === l ? '#fff' : COLORS.primary}
              />
              <Text style={[styles.labelChipText, label === l && styles.labelChipTextActive]}>
                {l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fields */}
        <Text style={styles.sectionLabel}>Contact Details</Text>
        <CustomInput placeholder="Full Name" value={name} onChangeText={setName} icon="person-outline" />
        <CustomInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" icon="call-outline" />

        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Address Details</Text>
        <CustomInput placeholder="Street Address / Flat / Area" value={address} onChangeText={setAddress} icon="home-outline" />
        <CustomInput placeholder="City" value={city} onChangeText={setCity} icon="business-outline" />
        <CustomInput placeholder="Pincode" value={pincode} onChangeText={setPincode} keyboardType="number-pad" icon="map-outline" />

        {/* Set as default toggle */}
        <TouchableOpacity
          style={styles.defaultToggle}
          onPress={() => setIsDefault(!isDefault)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
            {isDefault && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <View>
            <Text style={styles.defaultToggleTitle}>Set as default address</Text>
            <Text style={styles.defaultToggleSub}>This will be pre-selected at checkout</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : isEdit ? 'Update Address' : 'Save Address'}</Text>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: COLORS.textLight,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 16,
  },
  labelRow: { flexDirection: 'row', gap: 10 },
  labelChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14,
    backgroundColor: COLORS.primaryLight, borderWidth: 1.5, borderColor: 'transparent',
  },
  labelChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelChipText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  labelChipTextActive: { color: '#fff' },
  defaultToggle: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
    marginTop: 20, borderWidth: 1.5, borderColor: COLORS.border,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 7, borderWidth: 2,
    borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  defaultToggleTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  defaultToggleSub: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 17, marginTop: 28,
    shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default AddAddressScreen;
