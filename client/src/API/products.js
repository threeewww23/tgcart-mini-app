// ВСТАВЬТЕ СЮДА ВАШ ID ТАБЛИЦЫ
const SHEET_ID = "12QfMQYwyIWW9Q4sxhQVZZMLNmpoD01jZJ_CAmahUtTI"; 
const SHEET_NAME = "Лист1"; // Убедитесь, что вкладка называется так

export async function getProducts() {
  const reqUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  
  try {
    const response = await fetch(reqUrl);
    const data = await response.json();
    
    // Преобразуем данные из таблицы (цены из текста в числа)
    const formattedProducts = data.map(item => ({
      ...item,
      price: Number(item.price),
      discountPercentage: 0 // Заглушка, чтобы шаблон не ругался
    }));

    return { products: formattedProducts };
  } catch (error) {
    console.error("Ошибка загрузки товаров из таблицы:", error);
    return { products: [] };
  }
}

// Заглушка для категорий (пока отключим их)
export async function getCategories() {
  return ["all"];
}

// Получить один товар по ID (ищет в той же таблице)
export async function getProduct(id) {
  const reqUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  const response = await fetch(reqUrl);
  const data = await response.json();
  
  const product = data.find(item => String(item.id) === String(id));
  return {
    ...product,
    price: Number(product.price),
    discountPercentage: 0,
    images: [product.thumbnail] // В шаблоне используется массив картинок
  };
}