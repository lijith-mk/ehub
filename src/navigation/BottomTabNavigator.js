import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import HomeScreen from '../screens/Home/HomeScreen';
import CartScreen from '../screens/Cart/CartScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { CartContext } from '../context/CartContext';
import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

const CartBadge = ({ count }) => {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Cart: focused ? 'cart' : 'cart-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return (
            <View style={styles.iconWrap}>
              {focused && <View style={styles.activeIndicator} />}
              <Ionicons name={icons[route.name]} size={24} color={color} />
              {route.name === 'Cart' && <CartBadge count={cartCount} />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 68,
    paddingBottom: 10,
    paddingTop: 6,
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default BottomTabNavigator;
