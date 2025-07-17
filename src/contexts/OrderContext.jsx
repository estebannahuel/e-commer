// src/contexts/OrderContext.jsx (Modificado)
import React, { createContext, useContext, useState, useEffect } from 'react';
import initialOrdersData from '../data/orders.json';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext'; // Importar ProductContext

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        try {
            const storedOrders = localStorage.getItem('ecommerceOrders');
            return storedOrders ? JSON.parse(storedOrders) : initialOrdersData;
        } catch (e) {
            console.error("Error parsing orders from localStorage", e);
            return initialOrdersData;
        }
    });

    const { user } = useAuth();
    const { incrementPurchaseCount } = useProducts(); // Obtener la función del ProductContext

    useEffect(() => {
        localStorage.setItem('ecommerceOrders', JSON.stringify(orders));
    }, [orders]);

    const placeOrder = (cartItems, total) => {
        if (!user) {
            console.error("No user logged in to place order.");
            return null;
        }

        const newOrder = {
            id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            userId: user.id,
            userName: user.username,
            date: new Date().toISOString().slice(0, 10),
            status: "Pendiente",
            total: total,
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };
        setOrders(prevOrders => [...prevOrders, newOrder]);

        // NUEVO: Incrementar la cuenta de compras de cada producto en la orden
        newOrder.items.forEach(item => {
            incrementPurchaseCount(item.productId, item.quantity);
        });

        return newOrder;
    };

    const getUserOrders = (userId) => {
        return orders.filter(order => order.userId === userId);
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const deleteOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    };

    return (
        <OrderContext.Provider value={{
            orders,
            placeOrder,
            getUserOrders,
            getOrderById,
            updateOrderStatus,
            deleteOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => useContext(OrderContext);