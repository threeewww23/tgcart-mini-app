import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../API/products";
import getFinalPrice from "../utils/getFinalPrice";
import { useCart } from "../context/CartContext";

const initialState = {
  isLoading: true,
  product: null,
  count: 1,
};

export default function ProductView() {
  const { productId } = useParams();
  const [state, setState] = useState(initialState);
  const { isLoading, product, count } = state;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Состояния для выбранного размера и уведомления (Toast)
  const [selectedSize, setSelectedSize] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getProduct(productId).then((res) => {
      setState((prev) => ({ ...prev, product: res, isLoading: false }));
    });

    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.show();
      window.Telegram.WebApp.BackButton.onClick(() => {
        navigate("/");
        window.Telegram.WebApp.BackButton.hide();
      });
    }
  }, [productId, navigate]);

  const addToCount = (value = 1) => {
    setState((prev) => ({
      ...prev,
      count: prev.count + value < 1 ? 1 : prev.count + value,
    }));
  };

  const handleAddToCart = () => {
    // Если у товара есть размеры, но ни один не выбран — ругаемся
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
      }
      alert("Пожалуйста, выберите размер!");
      return;
    }

    addToCart(product, count, selectedSize);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    }

    // Показываем уведомление
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  if (isLoading || !product)
    return (
      <div className="fadeIn h-screen w-screen flex items-center justify-center">
        <span className="block animate-pulse material-symbols-outlined text-[var(--tg-theme-hint-color)] text-6xl">
          shopping_bag
        </span>
      </div>
    );

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="m-4 pb-20 relative">
      {/* Зеленое уведомление (Toast) */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 text-center font-bold fadeIn">
          ✅ Товар добавлен в корзину!
        </div>
      )}

      <section className="carousel relative h-[200px] rounded overflow-hidden">
        <ol className="carousel__viewport overflow-hidden">
          {images.map((image, index) => (
            <li
              key={index}
              className="carousel__slide"
              style={{ background: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="carousel__snapper"></div>
            </li>
          ))}
        </ol>
      </section>
      
      <div className="mt-4 font-medium text-lg">{product.title}</div>
      <p className="font-normal text-sm text-[var(--tg-theme-hint-color)] mt-2">
        {product.description}
      </p>
      
      <div className="text-xl font-bold my-3">
        {getFinalPrice(product)} руб.
      </div>

      {/* БЛОК РАЗМЕРОВ (Показывается, если в таблице есть колонка sizes) */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="my-4">
          <div className="text-sm text-[var(--tg-theme-hint-color)] mb-2">Выберите размер:</div>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map(size => (
              <button 
                key={size} 
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg font-bold border transition-all duration-200 ${
                  selectedSize === size 
                  ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] border-[var(--tg-theme-button-color)] scale-105' 
                  : 'bg-transparent text-[var(--tg-theme-text-color)] border-[var(--tg-theme-hint-color)] opacity-70'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-4 items-center mt-6">
        {/* Кнопки Плюс и Минус */}
        <div className="flex max-w-[120px] flex-row h-12 w-full rounded-lg bg-[var(--tg-theme-secondary-bg-color)]">
          <button onClick={() => addToCount(-1)} className="h-full w-12 rounded-l outline-none font-bold text-xl">-</button>
          <input type="number" readOnly className="focus:outline-none text-center w-full bg-transparent font-bold text-lg outline-none" value={count} />
          <button onClick={() => addToCount(1)} className="h-full w-12 rounded-r font-bold text-xl">+</button>
        </div>

        {/* Кнопка "В корзину" */}
        <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] h-12 rounded-lg font-bold transition-transform active:scale-95">
          <span className="material-symbols-outlined">add_shopping_cart</span>
          <span>В корзину</span>
        </button>
      </div>
    </div>
  );
}