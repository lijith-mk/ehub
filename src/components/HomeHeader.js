import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import COLORS from '../theme/colors';

const HomeHeader = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then((data) => {
        if (data) {
          const user = JSON.parse(data);
          setUserName(user.name?.split(' ')[0] || 'there');
        }
      })
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>{getGreeting()} 👋</Text>
        <Text style={styles.name}>{userName || 'Welcome'}</Text>
      </View>
      <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
        <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  left: {},
  greeting: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
    letterSpacing: -0.3,
  },
  notifBtn: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
});

export default HomeHeader;
