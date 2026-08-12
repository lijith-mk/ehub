import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import CartProvider from './src/context/CartContext';
import WishlistProvider from './src/context/WishlistContext';

function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <WishlistProvider>
          <AppNavigator />
        </WishlistProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}

export default App;
