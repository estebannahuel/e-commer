// src/contexts/CartContext.jsx
import React, { createContext, useContext } from 'react'; // Eliminamos useState y useEffect
import useLocalStorage from '../hooks/useLocalStorage'; // <-- Importa el hook personalizado

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // Utiliza useLocalStorage para el estado del carrito
    const [cartItems, setCartItems] = useLocalStorage('ecommerceCart', []);

    const addItemToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeItemFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateItemQuantity = (productId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addItemToCart,
            removeItemFromCart,
            updateItemQuantity,
            clearCart,
            getTotalItems,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);