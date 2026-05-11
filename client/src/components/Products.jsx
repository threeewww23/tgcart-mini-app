import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import Categories from "./Categories";
import "./products-style.css";
import getFinalPrice from "../utils/getFinalPrice";
import { useCart } from "../context/CartContext";

export default function Products() {
  const { activeCategory, products, categories, setCategory } = useProducts();
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const goToProductView = (product) => {
    navigate(`/product/${product.id}`);
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    }
  };

  // ФИЛЬТРАЦИЯ: по Поиску + по Категории!
  let displayedProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortOrder === "asc") {
    displayedProducts.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
  } else if (sortOrder === "desc") {
    displayedProducts.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
  }

  return (
    <div className="px-2 fadeIn pb-24">
      <Categories
        items={categories}
        active={activeCategory}
        onCategoryClick={setCategory}
      />

      <div className="my-3 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-md bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] outline-none"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full p-2 rounded-md bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] outline-none"
        >
          <option value="">Без сортировки</option>
          <option value="asc">Сначала дешевые</option>
          <option value="desc">Сначала дорогие</option>
        </select>
      </div>

      <section className="products">
        {displayedProducts.length === 0 ? (
          <div className="text-center w-full mt-4 text-[var(--tg-theme-hint-color)]">
            Товары не найдены
          </div>
        ) : (
          displayedProducts.map((product) => (
            <div key={product.id} className="product-item">
              <button onClick={() => goToProductView(product)}>
                <img
                  className="w-16 h-14 object-cover rounded"
                  src={product.thumbnail}
                  alt={product.title}
                />
              </button>
              <section className="flex-1" onClick={() => goToProductView(product)}>
                <div className="font-medium truncate text-sm">
                  {product.title}
                </div>
                <div className="text-sm flex gap-2 items-center">
                  <span className="font-bold">{getFinalPrice(product)} руб.</span>
                </div>
              </section>
              <section className="w-5">
                <button
                  onClick={() => goToProductView(product)}
                  className="p-2 text-[var(--tg-theme-button-color)]"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </section>
            </div>
          ))
        )}
      </section>

      {/* ПЛАВАЮЩАЯ КНОПКА: ПЕРЕХОД В КОРЗИНУ */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] p-3 rounded-xl shadow-lg flex justify-between items-center z-50">
          <div className="flex flex-col">
            <span className="font-bold text-sm">В корзине: {cartItems.reduce((acc, i) => acc + i.quantity, 0)} шт.</span>
            <span className="font-bold">{totalPrice} руб.</span>
          </div>
          <button 
            onClick={() => navigate("/cart")}
            className="bg-[var(--tg-theme-button-text-color)] text-[var(--tg-theme-button-color)] px-4 py-2 rounded-lg font-bold text-sm"
          >
            Перейти
          </button>
        </div>
      )}
    </div>
  );
}