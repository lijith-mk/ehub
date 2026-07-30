import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import CartProvider from './src/context/CartContext';

function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}

export default App;