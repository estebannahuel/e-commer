// src/utils/localStorageUtils.js

const PRODUCTS_STORAGE_KEY = 'ecommerce_products';
const CART_STORAGE_KEY = 'ecommerce_cart';
const ORDERS_STORAGE_KEY = 'ecommerce_orders';

// Función para inicializar productos si no existen en localStorage
export const initializeProducts = (defaultProducts) => {
  const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!storedProducts) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(storedProducts);
};

// Función para obtener productos
export const getProducts = () => {
  const products = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  return products ? JSON.parse(products) : [];
};

// Función para guardar productos
export const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

// Funciones para el Carrito
export const getCart = () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Funciones para Órdenes
export const getOrders = () => {
  const orders = localStorage.getItem(ORDERS_STORAGE_KEY);
  return orders ? JSON.parse(orders) : [];
};

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};