"use strict";

const USER_KEY = "loggedInUser";
const SELECTED_PRODUCTS_KEY = "selectedProducts";

const storageService = {
  getSelectedProducts() {
    const selectedProducts = JSON.parse(localStorage.getItem(SELECTED_PRODUCTS_KEY));
    return selectedProducts || [];
  },

  setSelectedProducts(products) {
    localStorage.setItem(SELECTED_PRODUCTS_KEY, JSON.stringify(products));
  },

  getUser() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    return user || null;
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAll() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SELECTED_PRODUCTS_KEY);
  },
};

