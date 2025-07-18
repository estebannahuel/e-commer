import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage'; // Importa tu hook personalizado

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // El carrito se almacenará en localStorage
    const [cartItems, setCartItems] = useLocalStorage('cartItems', []);

    // Calcula el total del carrito
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Calcula la cantidad total de ítems en el carrito (no productos únicos, sino la suma de cantidades)
    const totalItemsInCart = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Función para agregar un producto al carrito
    const addToCart = useCallback((product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                // Si el producto ya está en el carrito, actualiza la cantidad
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += quantity;
                return updatedItems;
            } else {
                // Si el producto no está en el carrito, agrégalo
                return [...prevItems, { ...product, quantity }];
            }
        });
    }, [setCartItems]);

    // Función para eliminar un producto del carrito
    const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, [setCartItems]);

    // Función para actualizar la cantidad de un producto en el carrito
    const updateQuantity = useCallback((productId, newQuantity) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, newQuantity) } // Asegura que la cantidad sea al menos 1
                    : item
            ).filter(item => item.quantity > 0); // Elimina si la cantidad llega a 0
        });
    }, [setCartItems]);

    // Función para vaciar completamente el carrito
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, [setCartItems]);

    const value = {
        cartItems,
        cartTotal,
        totalItemsInCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};