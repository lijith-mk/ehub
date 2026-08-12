import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/colors';

export const ADDRESSES_KEY = 'saved_addresses';

export const loadAddresses = () =>
  AsyncStorage.getItem(ADDRESSES_KEY)
    .then((d) => (d ? JSON.parse(d) : []))
    .catch(() => []);

export const saveAddresses = (list) =>
  AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(list)).catch(() => {});

const AddressBookScreen = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  // selectMode: when navigating from checkout to pick an address
  const selectMode = route.params?.selectMode || false;
  const onSelect = route.params?.onSelect;

  useFocusEffect(
    useCallback(() => {
      loadAddresses().then(setAddresses);
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert('Delete Address', 'Remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = addresses.filter((a) => a.id !== id);
          // If deleted was default, set first remaining as default
          if (addresses.find((a) => a.id === id)?.isDefault && updated.length > 0) {
            updated[0].isDefault = true;
          }
          setAddresses(updated);
          saveAddresses(updated);
        },
      },
    ]);
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    saveAddresses(updated);
  };

  const handleSelect = (address) => {
    if (selectMode && onSelect) {
      onSelect(address);
      navigation.goBack();
    }
  };

  const renderAddress = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.isDefault && styles.cardDefault]}
      activeOpacity={selectMode ? 0.8 : 1}
      onPress={() => selectMode && handleSelect(item)}
    >
      {/* Default badge */}
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Ionicons name="home" size={11} color={COLORS.primary} />
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}

      {/* Label */}
      <View style={styles.labelRow}>
        <View style={styles.labelIcon}>
          <Ionicons
            name={item.label === 'Home' ? 'home-outline' : item.label === 'Work' ? 'briefcase-outline' : 'location-outline'}
            size={16}
            color={COLORS.primary}
          />
        </View>
        <Text style={styles.label}>{item.label}</Text>
        {selectMode && (
          <View style={styles.selectIndicator}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
          </View>
        )}
      </View>

      {/* Address details */}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.addressText}>
        {item.address}, {item.city} - {item.pincode}
      </Text>
      <Text style={styles.phone}>{item.phone}</Text>

      {/* Actions */}
      {!selectMode && (
        <View style={styles.actions}>
          {!item.isDefault && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleSetDefault(item.id)}
            >
              <Text style={styles.actionBtnText}>Set as Default</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AddAddress', { address: item })}
          >
            <Ionicons name="create-outline" size={14} color={COLORS.primary} />
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
            <Text style={[styles.actionBtnText, { color: COLORS.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectMode ? 'Select Address' : 'Saved Addresses'}
        </Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddAddress', {})}
        >
          <Ionicons name="add" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddress}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="location-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySub}>Add your delivery addresses for faster checkout</Text>
            <TouchableOpacity
              style={styles.addNewBtn}
              onPress={() => navigation.navigate('AddAddress', {})}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.addNewBtnText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {addresses.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addNewBtn}
            onPress={() => navigation.navigate('AddAddress', {})}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addNewBtnText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      )}
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
  addBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 18,
    marginBottom: 14, borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  cardDefault: { borderColor: COLORS.primary },
  defaultBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', backgroundColor: COLORS.primaryLight,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10,
  },
  defaultBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  labelIcon: {
    width: 30, height: 30, borderRadius: 10, backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center',
  },
  label: { fontSize: 15, fontWeight: '800', color: COLORS.text, flex: 1 },
  selectIndicator: { marginLeft: 'auto' },
  name: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 3 },
  addressText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 3 },
  phone: { fontSize: 13, color: COLORS.textLight },
  actions: {
    flexDirection: 'row', gap: 8, marginTop: 14,
    paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  deleteBtn: { backgroundColor: COLORS.dangerLight },
  actionBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: {
    width: 88, height: 88, borderRadius: 28, backgroundColor: COLORS.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  emptySub: {
    fontSize: 14, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: 40,
  },
  footer: { padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },
  addNewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 16,
    shadowColor: COLORS.primary, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  addNewBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default AddressBookScreen;
