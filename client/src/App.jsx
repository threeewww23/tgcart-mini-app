import Products from "./components/Products";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ProductView from "./components/ProductView";
import CartPage from "./components/CartPage"; // ДОБАВИЛИ ИМПОРТ
import { CartProvider } from "./context/CartContext";

window.Telegram = window.Telegram || {
  WebApp: {
    initData: "",
    HapticFeedback: { impactOccurred: () => {} },
    BackButton: { show: () => {}, hide: () => {}, onClick: () => {} },
    MainButton: { show: () => {}, hide: () => {}, onClick: () => {}, setParams: () => ({ show: () => {} }) },
    openTelegramLink: (url) => window.open(url, "_blank"),
    openInvoice: () => alert("Оплата (Invoice) работает только в Telegram"),
    onEvent: () => {}
  }
};

export function App() {
  return (
    <CartProvider>
      <div className="app h-screen overflow-x-hidden relative">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/product/:productId" element={<ProductView />} />
            <Route path="/cart" element={<CartPage />} /> {/* ДОБАВИЛИ МАРШРУТ */}
          </Routes>
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}