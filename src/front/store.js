export const initialStore = () => {
  return {
    token: null,
    cartItems: [],
    products: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "GET_PRODUCTS":
      return {
        ...store,
        products: action.payload,
      };
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existingItem = store.cartItems.find(
        (item) => item.id === product.id
      );
      const productInStock = store.products.find(
        (item) => item.id === product.id
      );

      if (!productInStock) {
        return store;
      }
      if (existingItem) {
        const proposedTotalQuantity = existingItem.cantidad + quantity;

        if (proposedTotalQuantity > productInStock.stock_quantity) {
          return store;
        } else {
          return {
            ...store,
            cartItems: store.cartItems.map((item) =>
              item.id === product.id
                ? { ...item, cantidad: proposedTotalQuantity }
                : item
            ),
          };
        }
      } else {
        if (quantity > productInStock.stock_quantity) {
          console.warn(
            `La cantidad inicial (${quantity}) excede el stock disponible (${productInStock.stock_quantity}) para el producto ID ${product.id}.`
          );

          return store;
        } else {
          return {
            ...store,
            cartItems: [...store.cartItems, { ...product, cantidad: quantity }],
          };
        }
      }
    }

    case "DECREMENT_ITEM": {
      const { productId } = action.payload;
      const updatedCart = store.cartItems.map((item) =>
        item.id === productId ? { ...item, cantidad: item.cantidad - 1 } : item
      );

      return {
        ...store,
        cartItems: updatedCart.filter((item) => item.cantidad > 0),
      };
    }

    case "REMOVE_ITEM": {
      const { productId } = action.payload;
      return {
        ...store,
        cartItems: store.cartItems.filter((item) => item.id !== productId),
      };
    }
    case "RESET_CART":
      return {
        ...store,
        cartItems: [],
      };

    case "LOGIN":
      return {
        ...store,
        token: action.payload,
      };

    case "LOGOUT":
      return {
        ...store,
        token: null,
        cartItems: [],
      };

    default:
      return store;
  }
}
