/**
 * CartContext.js — Shared state for the booking cart.
 * Manages selections across listings, details, and summary pages.
 * Persists cart to localStorage (FR13).
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "fixmate_cart";

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  // Persist to localStorage whenever cart changes (useEffect — FR13)
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((service, slot, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.serviceId === service.id && item.slot === slot
      );
      if (existingIndex >= 0) {
        // Update quantity immutably
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          unit: service.unit,
          slot,
          quantity,
          image: service.image,
          provider: service.provider.name,
          category: service.category,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((serviceId, slot) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.serviceId === serviceId && item.slot === slot))
    );
  }, []);

  const updateQuantity = useCallback((serviceId, slot, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.serviceId === serviceId && item.slot === slot
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getItemCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const isInCart = (serviceId) =>
    cartItems.some((item) => item.serviceId === serviceId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
