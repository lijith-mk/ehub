import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../navigation/navigationRef';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../theme/colors';

const MenuItem = ({ icon, label, subtitle, onPress, danger }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
      <Ionicons name={icon} size={20} color={danger ? COLORS.danger : COLORS.primary} />
    </View>
    <View style={styles.menuText}>
      <Text style={[styles.menuLabel, danger && { color: COLORS.danger }]}>{label}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    {!danger && <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  // Reload user data every time screen comes into focus (e.g. after EditProfile)
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('user')
        .then((data) => {
          if (data) setUser(JSON.parse(data));
        })
        .catch(() => {});
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          AsyncStorage.multiRemove(['token', 'user'])
            .then(() => {
              if (navigationRef.isReady()) {
                navigationRef.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              }
            })
            .catch(() => {
              if (navigationRef.isReady()) {
                navigationRef.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              }
            });
        },
      },
    ]);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.headerBg}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Orders', value: '12' },
            { label: 'Wishlist', value: '5' },
            { label: 'Reviews', value: '8' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="bag-outline" label="My Orders" subtitle="Track & manage orders" onPress={() => navigation.navigate('MyOrders')} />
            <MenuItem icon="heart-outline" label="Wishlist" subtitle="Saved items" onPress={() => navigation.navigate('Wishlist')} />
            <MenuItem icon="location-outline" label="Addresses" subtitle="Delivery addresses" />
            <MenuItem icon="card-outline" label="Payment Methods" subtitle="Saved cards & UPI" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="help-circle-outline" label="Help & FAQ" />
            <MenuItem icon="chatbubble-outline" label="Chat Support" />
            <MenuItem icon="star-outline" label="Rate the App" />
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.menuCard}>
            <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleLogout} danger />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBg: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
    marginBottom: 14,
  },
  editBtn: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  editBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
    marginTop: 3,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 1,
  },
});

export default ProfileScreen;
