import { useEffect } from "react";
import getFinalPrice from "../utils/getFinalPrice";
import { onMainButtonClick } from "../API/app-events";

export default function Checkout({ product, count }) {
  const price = (getFinalPrice(product) * count).toFixed(2);
  const savedAmount = (product.price * count - price).toFixed(2);

  useEffect(() => {
    onMainButtonClick(() => {
      Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
      
      // СЮДА ВПИШИТЕ ТЕЛЕГРАМ-ЛОГИН ВАШЕГО КЛИЕНТА (ПРОДАВЦА) БЕЗ @
      const sellerUsername = "threeew"; 

      // Формируем текст сообщения
      const orderText = `🛒 *Новый заказ!*\n\n▪️ Товар: ${product.title}\n▪️ Количество: ${count} шт.\n💰 Итого к оплате: ${price} руб.`;
      
      // Кодируем текст для ссылки и открываем чат с продавцом
      const encodedText = encodeURIComponent(orderText);
      Telegram.WebApp.openTelegramLink(`https://t.me/${sellerUsername}?text=${encodedText}`);
    });
  }, [product, count, price]);

  return (
    <section className="p-4 gap-4 text-center">
      <div className="text-base font-medium">Оформление заказа</div>
      <img
        className="w-40 h-40 block rounded object-cover m-auto my-4"
        src={product.thumbnail}
        alt={product.title}
      />
      <div>{product.title}</div>
      <span className="text-sm text-[var(--tg-theme-hint-color)]">
        {count} шт.
      </span>

      <div className="my-2">
        <span className="font-medium">
          {price} руб.
        </span>
        {savedAmount > 0 && (
          <div className="text-[var(--tg-theme-button-color)] text-xs p-1">
            Вы сэкономите {savedAmount} руб.!
          </div>
        )}
      </div>
    </section>
  );
}