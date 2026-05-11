import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../API/products";
import getFinalPrice from "../utils/getFinalPrice";
import Checkout from "./Checkout";

const initialState = {
  isLoading: true,
  product: null,
  count: 1,
  showCheckout: false,
};

export default function ProductView() {
  const { productId } = useParams();
  const [state, setState] = useState(initialState);
  const { isLoading, product, count, showCheckout } = state;
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(productId).then((res) => {
      setState((prev) => ({ ...prev, product: res, isLoading: false }));
    });

    // Безопасный вызов кнопки "Назад" (не упадет в браузере)
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.onClick(() => {
        setState((prev) => {
          if (window.Telegram?.WebApp?.MainButton) window.Telegram.WebApp.MainButton.hide();

          if (prev.showCheckout) {
            return { ...prev, showCheckout: false };
          } else {
            navigate("/");
            if (window.Telegram?.WebApp?.BackButton) window.Telegram.WebApp.BackButton.hide();
          }
          return prev;
        });
      });
    }
  }, [productId, navigate]);

  const addToCount = (value = 1) => {
    setState((prev) => ({
      ...prev,
      count: prev.count + value < 1 ? 1 : prev.count + value,
    }));
    // Отключаем HapticFeedback (вибрацию) для браузера, чтобы не было красных ошибок
    // if (window.Telegram?.WebApp?.HapticFeedback) {
    //   window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    // }
  };

  const handleBuy = () => {
    setState((prev) => ({ ...prev, showCheckout: true }));
    
    // В браузере этой кнопки нет, поэтому оборачиваем в try/catch или проверку
    if (window.Telegram?.WebApp?.MainButton?.setParams) {
      try {
        window.Telegram.WebApp.MainButton.setParams({
          text: `Pay $ ${getFinalPrice(product, count)}`,
        }).show();
      } catch(e) {}
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

  if (showCheckout) {
    return <Checkout product={product} count={count} />;
  }

  // Безопасное получение картинок (вдруг из Google Таблицы пришла пустая ячейка)
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="m-4">
      <section
        className="carousel relative h-[200px] rounded overflow-hidden"
        aria-label="Gallery"
      >
        <ol className="carousel__viewport overflow-hidden">
          {images.map((image, index) => (
            <li
              key={index} // ДОБАВЛЕН KEY, ЧТОБЫ REACT НЕ РУГАЛСЯ
              id={`carousel__slide${index + 1}`}
              tabIndex="0" // ИСПРАВЛЕНА ОПЕЧАТКА tabindex -> tabIndex
              style={{ background: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
              className="carousel__slide"
            >
              <div className="carousel__snapper"></div>
              {images.length > 1 && (
                <>
                  <a
                    href={`#carousel__slide${index < 1 ? images.length : index}`}
                    className="carousel__prev"
                  >
                    Go to previous slide
                  </a>
                  <a
                    href={`#carousel__slide${
                      index + 2 > images.length ? 1 : index + 2
                    }`}
                    className="carousel__next"
                  >
                    Go to next slide
                  </a>
                </>
              )}
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
          <button
            onClick={() => addToCount(-1)}
            className=" bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-hint-color) hover:bg-[rgba(255,255,255,0.1)] h-full w-16 rounded-l cursor-pointer outline-none"
          >
            <span className="m-auto text-2xl font-thin">{"-"}</span>
          </button>
          
          <input
            type="number"
            readOnly // ИСПРАВЛЕНА ОШИБКА "You provided a value prop..."
            className="focus:outline-none text-center w-full bg-[var(--tg-theme-secondary-bg-color)] font-semibold text-md md:text-base cursor-default flex items-center outline-none"
            value={count}
          />
          
          <button
            onClick={() => addToCount(1)}
            className="bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-hint-color) hover:bg-[rgba(255,255,255,0.1)] h-full w-16 rounded-r cursor-pointer"
          >
            <span className="m-auto text-2xl font-thin">+</span>
          </button>
        </div>

        <button
          onClick={handleBuy}
          className="text-[var(--tg-theme-button-text-color)] flex items-center gap-2 bg-[var(--tg-theme-button-color)] p-2 px-4 rounded-md font-medium my-2"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}