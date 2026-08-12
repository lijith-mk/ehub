import React, { createContext, useState } from 'react';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (product) => {
    if (!wishlist.find((p) => p._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((p) => p._id !== productId));
  };

  const isWishlisted = (productId) =>
    !!wishlist.find((p) => p._id === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
