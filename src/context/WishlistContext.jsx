import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('vennoirr_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('vennoirr_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isExisting = prev.find(item => item._id === (product._id || product.id));
      if (isExisting) {
        toast.success("Removed from wishlist");
        return prev.filter(item => item._id !== (product._id || product.id));
      }
      toast.success("Added to wishlist");
      return [...prev, { ...product, _id: product._id || product.id }];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item._id !== id));
    toast.success("Removed from wishlist");
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
