export const getAllProducts = async () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(`${url}/api/products`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error al obtener los productos del servidor.");
    }
  } catch (error) {
    console.error("Error en la función los detalles de los productos:", error);
    throw error;
  }
};

export const getProduct = async (id) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  try {
    const response = await fetch(`${url}/api/products/${id}`, {
      method: "GET",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error al obtener los productos del servidor.");
    }
  } catch (error) {
    console.error("Error al obtener los detalles del producto:", error);
    throw error;
  }
};

export const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];

    switch (sortBy) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }

    return sortedProducts;
};

export const calculateCartTotal = (cartItems) => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((acc, item) => acc + item.price * item.cantidad, 0);
};