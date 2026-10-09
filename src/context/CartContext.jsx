import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('vennoirr_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vennoirr_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (payload) => {
    const { _id, id, size, color, qty, variant } = payload;
    const productId = _id || id;
    
    setCart(prev => {
      // Find exact composite key match: Product + Size + Color
      const existing = prev.find(item => 
        item._id === productId && 
        item.size === size && 
        item.color === color
      );
      
      if (existing) {
        // Enforce stock ceiling if variant exists
        const stockCeiling = variant?.stockCount || existing.stockCount || 999;
        const newQty = existing.quantity + (qty || 1);
        
        if (newQty > stockCeiling) {
          toast.error(`Only ${stockCeiling} available in stock!`);
          return prev;
        }
        
        toast.success("Increased quantity in cart");
        return prev.map(item => 
          (item._id === productId && item.size === size && item.color === color)
            ? { ...item, quantity: newQty } 
            : item
        );
      }
      
      toast.success("Added to cart");
      return [...prev, { 
        ...payload, 
        _id: productId, 
        quantity: qty || 1 
      }];
    });
    setSidebarOpen(true);
  };

  const removeFromCart = (id, size, color) => {
    setCart(prev => prev.filter(item => 
      !(item._id === id && item.size === size && item.color === color)
    ));
  };

  const updateQty = (id, size, color, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      (item._id === id && item.size === size && item.color === color) 
        ? { ...item, quantity } 
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartTotal, cartCount, loading, addToCart, removeFromCart, updateQty, clearCart, sidebarOpen, setSidebarOpen }}>
      {children}
    </CartContext.Provider>
  );
};
