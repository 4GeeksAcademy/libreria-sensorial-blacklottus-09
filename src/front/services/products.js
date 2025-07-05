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
