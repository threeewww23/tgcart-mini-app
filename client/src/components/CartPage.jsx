import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const sellerUsername = "threeewww23"; // ВАШ ЛОГИН
    let orderText = "🛍 *Новый заказ!*\n\n";
    cartItems.forEach(item => {
      const sizeText = item.selectedSize ? ` (Размер: ${item.selectedSize})` : "";
      orderText += `▪️ ${item.title}${sizeText} x${item.quantity} — ${item.price * item.quantity} руб.\n`;
    });
    orderText += `\n💰 *Итого:* ${totalPrice} руб.`;
    
    const encodedText = encodeURIComponent(orderText);
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${sellerUsername}?text=${encodedText}`);
    } else {
      window.open(`https://t.me/${sellerUsername}?text=${encodedText}`, "_blank");
    }
  };

  return (
    <div className="p-4 pb-20 fadeIn">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/")} className="text-[var(--tg-theme-hint-color)]">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold">Корзина</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center mt-20 text-[var(--tg-theme-hint-color)]">
          <span className="material-symbols-outlined text-6xl block mb-2">production_quantity_limits</span>
          Ваша корзина пуста
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex gap-4 bg-[var(--tg-theme-secondary-bg-color)] p-3 rounded-xl">
              <img src={item.thumbnail} className="w-20 h-20 object-cover rounded-lg" alt={item.title} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm leading-tight">{item.title}</h3>
                  {item.selectedSize && <span className="text-xs text-[var(--tg-theme-hint-color)]">Размер: {item.selectedSize}</span>}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">{item.price * item.quantity} руб.</span>
                  
                  {/* Кнопки плюс/минус */}
                  <div className="flex items-center bg-[var(--tg-theme-bg-color)] rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="w-8 h-8 flex items-center justify-center">-</button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="w-8 h-8 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-red-500 self-start">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}

          <div className="mt-6 border-t border-[var(--tg-theme-hint-color)] pt-4 opacity-50"></div>
          <div className="flex justify-between items-center text-lg font-bold mb-4">
            <span>Итого:</span>
            <span>{totalPrice} руб.</span>
          </div>

          <button onClick={handleCheckout} className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] py-3 rounded-xl font-bold text-lg">
            Оформить заказ
          </button>
        </div>
      )}
    </div>
  );
}