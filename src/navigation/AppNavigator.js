import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

import BottomTabNavigator from './BottomTabNavigator';

import ProductDetailsScreen from '../screens/Product/ProductDetailsScreen';

import CheckoutScreen from '../screens/Cart/CheckoutScreen';
import OrderSuccessScreen from '../screens/Cart/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Authentication */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        {/* Main App */}
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
        />

        {/* Product */}
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
        />

        {/* Cart */}
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
        />

        <Stack.Screen
          name="OrderSuccess"
          component={OrderSuccessScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;