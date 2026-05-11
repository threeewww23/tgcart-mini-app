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
  const { addToCart } = useCart(); // Подключаем корзину!

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
    addToCart(product, count);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
    // После добавления в корзину возвращаем пользователя в каталог
    navigate("/");
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.hide();
    }
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
    <div className="m-4">
      <section className="carousel relative h-[200px] rounded overflow-hidden">
        <ol className="carousel__viewport overflow-hidden">
          {images.map((image, index) => (
            <li
              key={index}
              id={`carousel__slide${index + 1}`}
              tabIndex="0"
              style={{ background: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
              className="carousel__slide"
            >
              <div className="carousel__snapper"></div>
            </li>
          ))}
        </ol>
      </section>
      
      <div className="mt-4 font-medium">{product.title}</div>
      <p className="font-normal text-sm text-[var(--tg-theme-hint-color)] line-clamp-3 mt-1">
        {product.description}
      </p>
      
      <div className="text-sm flex gap-2 items-center my-2">
        <span className="text-md font-bold">{getFinalPrice(product)} руб.</span>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="flex max-w-[100px] flex-row h-10 w-full rounded-lg relative bg-transparent">
          <button onClick={() => addToCount(-1)} className="bg-[var(--tg-theme-secondary-bg-color)] h-full w-16 rounded-l outline-none">
            <span className="m-auto text-2xl font-thin">-</span>
          </button>
          <input type="number" readOnly className="focus:outline-none text-center w-full bg-[var(--tg-theme-secondary-bg-color)] font-semibold text-md cursor-default outline-none" value={count} />
          <button onClick={() => addToCount(1)} className="bg-[var(--tg-theme-secondary-bg-color)] h-full w-16 rounded-r">
            <span className="m-auto text-2xl font-thin">+</span>
          </button>
        </div>

        <button onClick={handleAddToCart} className="text-[var(--tg-theme-button-text-color)] flex items-center gap-2 bg-[var(--tg-theme-button-color)] p-2 px-4 rounded-md font-medium my-2 w-full justify-center">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span>В корзину</span>
        </button>
      </div>
    </div>
  );
}