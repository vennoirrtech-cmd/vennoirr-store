import { createContext, useState, useEffect } from "react";
import { addToCartAPI, getCart, updateCartItemAPI, removeCartItemAPI } from "../services/cartService";
import { toast } from "react-hot-toast";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart_items");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const fetchApiCart = async () => {
    if (!localStorage.getItem('jwt_token')) return;
    try {
      setLoading(true);
      const res = await getCart();
      if (res.success && res.data?.items) {
        // Map backend schema to frontend expectations
        const mapped = res.data.items.map(item => ({
          ...item.product, // Populated product data
          size: item.size,
          color: item.color,
          qty: item.quantity,
          cartItemId: item._id
        }));
        setCart(mapped);
      }
    } catch (err) {
      console.error("Cart sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiCart();

    const onLogin = async () => {
      // Find items in local cart that haven't been synced to the backend
      const localItems = JSON.parse(localStorage.getItem("cart_items") || "[]");
      for (const item of localItems) {
        if (!item.cartItemId) {
          try {
             await addToCartAPI({
              product: item._id || item.id,
              size: item.size || 'M',
              color: item.colors?.[0] || 'Black',
              quantity: item.qty || 1
            });
          } catch {
            console.error("Sync failed for item", item);
          }
        }
      }
      fetchApiCart(); // Pull the fresh combined cart
    };

    window.addEventListener("auth_login", onLogin);
    return () => window.removeEventListener("auth_login", onLogin);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (item) => {
    // 1. Optimistic UI update
    setCart((prev) => {
      const idx = prev.findIndex((c) => (c._id || c.id) === (item._id || item.id) && c.size === item.size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + (item.qty || 1) };
        return copy;
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });

    // 2. Sync to API if logged in
    if (localStorage.getItem('jwt_token')) {
      try {
        await addToCartAPI({
          product: item._id || item.id,
          size: item.size || 'M',
          color: item.colors?.[0] || 'Black',
          quantity: item.qty || 1
        });
        // Fetch to ensure correct DB IDs
        fetchApiCart();
        toast.success("Added to cart");
      } catch(err) {
        console.error("Failed to add to API cart", err);
        toast.error(err?.response?.data?.message || "Failed to add to cart");
        // Revert optimistic update by pulling true state from server
        fetchApiCart();
      }
    } else {
      toast.success("Added to cart");
    }
  };

  const removeFromCart = async (index) => {
    const itemToRemove = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));

    if (localStorage.getItem('jwt_token') && itemToRemove.cartItemId) {
      try {
        await removeCartItemAPI(itemToRemove.cartItemId);
        toast.success("Item removed");
      } catch(err) {
        console.error("Failed to remove API cart item", err);
        toast.error("Failed to remove item");
        fetchApiCart();
      }
    } else {
      toast.success("Item removed");
    }
  };

  const updateQty = async (index, delta) => {
    const itemToUpdate = cart[index];
    const newQty = Math.max(1, itemToUpdate.qty + delta);
    
    setCart((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], qty: newQty };
      return copy;
    });

    if (localStorage.getItem('jwt_token') && itemToUpdate.cartItemId) {
      try {
        await updateCartItemAPI(itemToUpdate.cartItemId, newQty);
      } catch(err) {
        console.error("Failed to update API cart item", err);
        toast.error(err?.response?.data?.message || "Failed to update quantity");
        fetchApiCart();
      }
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart_items");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
