// src/contexts/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import initialOrdersData from '../data/orders.json';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import useLocalStorage from '../hooks/useLocalStorage';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useLocalStorage('ecommerceOrders', () => {
        // Asegúrate de que initialOrdersData sea un array. Si no lo es, usa un array vacío.
        const dataToMap = Array.isArray(initialOrdersData) ? initialOrdersData : [];
        return dataToMap.map(order => ({
            ...order,
            isNewForAdmin: order.isNewForAdmin !== undefined ? order.isNewForAdmin : false
        }));
    });

    const { user } = useAuth();
    const { incrementPurchaseCount } = useProducts();

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
            isNewForAdmin: true,
            total: total,
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };
        setOrders(prevOrders => [...prevOrders, newOrder]);

        newOrder.items.forEach(item => {
            incrementPurchaseCount(item.productId, item.quantity);
        });

        return newOrder;
    };

    const getUserOrders = (userId) => {
        // Asegúrate de que 'orders' es un array antes de intentar filtrar
        return Array.isArray(orders) ? orders.filter(order => order.userId === userId) : [];
    };

    const getOrderById = (orderId) => {
        return Array.isArray(orders) ? orders.find(order => order.id === orderId) : undefined;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders =>
            Array.isArray(prevOrders) ? prevOrders.map(order => {
                if (order.id === orderId) {
                    const updatedOrder = { ...order, status: newStatus };
                    if ((order.status === 'Pendiente' || order.status === 'Pagado') && newStatus !== 'Pendiente' && newStatus !== 'Pagado' && updatedOrder.isNewForAdmin) {
                        updatedOrder.isNewForAdmin = false;
                    }
                    return updatedOrder;
                }
                return order;
            }) : []
        );
    };

    const deleteOrder = (orderId) => {
        setOrders(prevOrders => Array.isArray(prevOrders) ? prevOrders.filter(order => order.id !== orderId) : []);
    };

    const getPendingOrdersCount = () => {
        return Array.isArray(orders) ? orders.filter(order =>
            (order.status === 'Pendiente' || order.status === 'Pagado') && order.isNewForAdmin
        ).length : 0;
    };

    const markOrderAsReviewed = (orderId) => {
        setOrders(prevOrders =>
            Array.isArray(prevOrders) ? prevOrders.map(order =>
                order.id === orderId && (order.status === 'Pendiente' || order.status === 'Pagado')
                    ? { ...order, status: 'En Proceso', isNewForAdmin: false }
                    : order
            ) : []
        );
    };

    const markOrderAsPaid = (orderId) => {
        setOrders(prevOrders =>
            Array.isArray(prevOrders) ? prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'Pagado', isNewForAdmin: true }
                    : order
            ) : []
        );
    };

    return (
        <OrderContext.Provider value={{
            orders,
            placeOrder,
            getUserOrders,
            getOrderById,
            updateOrderStatus,
            deleteOrder, 
            getPendingOrdersCount,
            markOrderAsReviewed,
            markOrderAsPaid
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => useContext(OrderContext);