import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Очистить корзину после успешного заказа
  const clearCart = () => setCartItems([]);

  // Добавить товар в корзину
  const addToCart = (product, quantity) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => String(item.id) === String(product.id));
      if (existingItem) {
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  // Удалить один товар из корзины (или уменьшить количество)
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => String(item.id) === String(productId));
      if (existingItem.quantity === 1) {
        return prev.filter((item) => String(item.id) !== String(productId));
      }
      return prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  // Подсчет общей суммы
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};