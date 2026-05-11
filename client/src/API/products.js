// ВСТАВЬТЕ СЮДА ВАШ ID ТАБЛИЦЫ
const SHEET_ID = "12QfMQYwyIWW9Q4sxhQVZZMLNmpoD01jZJ_CAmahUtTI"; 
const SHEET_NAME = "Лист1"; // Убедитесь, что вкладка называется так

export async function getProducts() {
  const reqUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
  try {
    const response = await fetch(reqUrl);
    const data = await response.json();
    
    const formattedProducts = data.map(item => ({
      ...item,
      price: Number(item.price),
      discountPercentage: 0,
      category: item.category || "Без категории",
      sizes: item.sizes ? String(item.sizes).split(',').map(s => s.trim()) : []
    }));
    return { products: formattedProducts };
  } catch (error) {
    return { products: [] };
  }
}

// Получаем уникальные категории из товаров
export async function getCategories() {
  const { products } = await getProducts();
  const allCategories = products.map(p => p.category);
  const uniqueCategories = [...new Set(allCategories)];
  return ["all", ...uniqueCategories];
}

export async function getProduct(id) {
  const { products } = await getProducts();
  const product = products.find(item => String(item.id) === String(id));
  return {
    ...product,
    images: [product.thumbnail]
  };
}