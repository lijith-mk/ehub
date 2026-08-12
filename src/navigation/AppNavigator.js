import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './navigationRef';

import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

import BottomTabNavigator from './BottomTabNavigator';

import ProductDetailsScreen from '../screens/Product/ProductDetailsScreen';
import CheckoutScreen from '../screens/Cart/CheckoutScreen';
import OrderSuccessScreen from '../screens/Cart/OrderSuccessScreen';
import MyOrdersScreen from '../screens/Orders/MyOrdersScreen';
import OrderDetailScreen from '../screens/Orders/OrderDetailScreen';
import WishlistScreen from '../screens/Wishlist/WishlistScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import CouponScreen from '../screens/Coupon/CouponScreen';
import AddressBookScreen from '../screens/Address/AddressBookScreen';
import AddAddressScreen from '../screens/Address/AddAddressScreen';
import FlashSaleScreen from '../screens/Deals/FlashSaleScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Coupon" component={CouponScreen} />
        <Stack.Screen name="AddressBook" component={AddressBookScreen} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
        <Stack.Screen name="FlashSale" component={FlashSaleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
