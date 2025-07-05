export const initialStore = () => {
  return {
    totalItems: 0,
    token: null,
    localCart: [],
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
