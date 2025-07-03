export const initialStore = () => {
  return {
    totalItems: 0,
    token: null, // Es mejor usar null que un string vacío para el token
    localCart: [], // Necesitarás el carrito para la lógica de compra
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...store,
        localCart: [...store.localCart, action.payload],
      };

    case "INCREMENT_TOTAL_ITEMS":
      return {
        ...store,
        totalItems: store.totalItems + 1,
      };

    case "DECREMENT_TOTAL_ITEMS":
      return {
        ...store,
        totalItems: store.totalItems > 0 ? store.totalItems - 1 : 0,
      };

    case "RESET_TOTAL_ITEMS":
      return {
        ...store,
        totalItems: 0,
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
        localCart: [],
        totalItems: 0,
      };

    default:
      return store;
  }
}
