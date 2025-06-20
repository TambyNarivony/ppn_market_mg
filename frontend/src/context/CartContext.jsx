import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';


const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ppn_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('ppn_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (subProduct, quantity = 1) => {
     await api.post('/cart', {
      sub_product_id: subProduct.id,
      quantity: quantity
    });
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === subProduct.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === subProduct.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { ...subProduct, quantity }];
      }
    });
  };

  const removeFromCart = (subProductId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== subProductId));
  };

  const updateQuantity = (subProductId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(subProductId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === subProductId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};