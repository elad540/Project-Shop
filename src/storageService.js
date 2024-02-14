"use strict";

// Constants representing keys for local storage
const USER_KEY = "loggedInUser";
const SELECTED_PRODUCTS_KEY = "selectedProducts";

// Object encapsulating methods for interacting with local storage
const storageService = {
  // Retrieve the selected products from local storage, or an empty array if not present
  getSelectedProducts() {
    const selectedProducts = JSON.parse(localStorage.getItem(SELECTED_PRODUCTS_KEY));
    return selectedProducts || [];
  },

  // Store the provided selected products in local storage
  setSelectedProducts(products) {
    localStorage.setItem(SELECTED_PRODUCTS_KEY, JSON.stringify(products));
  },

  // Retrieve user information from local storage, or null if not present
  getUser() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    return user || null;
  },

  // Store the provided user information in local storage
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Remove both user and selected products information from local storage
  clearAll() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(SELECTED_PRODUCTS_KEY);
  },
};

