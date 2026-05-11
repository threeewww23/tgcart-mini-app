import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const clearCart = () => setCartItems([]);

  // Добавляем с учетом выбранного размера
  const addToCart = (product, quantity, size = null) => {
    setCartItems((prev) => {
      // Ищем товар с ТАКИМ ЖЕ id и ТАКИМ ЖЕ размером
      const existingItem = prev.find(
        (item) => String(item.id) === String(product.id) && item.selectedSize === size
      );
      if (existingItem) {
        return prev.map((item) =>
          String(item.id) === String(product.id) && item.selectedSize === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (productId, size = null) => {
    setCartItems((prev) => prev.filter((item) => !(String(item.id) === String(productId) && item.selectedSize === size)));
  };

  const updateQuantity = (productId, size, amount) => {
    setCartItems((prev) => prev.map((item) => {
      if (String(item.id) === String(productId) && item.selectedSize === size) {
        const newQuantity = item.quantity + amount;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};