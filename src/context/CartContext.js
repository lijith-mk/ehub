import React, { createContext, useState } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add Product
  const addToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      const updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );

      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };

  // Remove Product
  const removeFromCart = productId => {
    const updatedCart = cartItems.filter(
      item => item.id !== productId
    );

    setCartItems(updatedCart);
  };

  // Increase Quantity
  const increaseQuantity = productId => {
    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCartItems(updatedCart);
  };

  // Decrease Quantity
  const decreaseQuantity = productId => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        return {
          ...item,
          quantity:
            item.quantity > 1
              ? item.quantity - 1
              : 1,
        };
      }

      return item;
    });

    setCartItems(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;