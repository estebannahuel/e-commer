// src/contexts/OrderContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import initialOrdersData from '../data/orders.json';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';
import useLocalStorage from '../hooks/useLocalStorage';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    // Inicializa orders con los datos del localStorage o initialOrdersData.
    // Es CRUCIAL que los pedidos viejos que no tienen 'isNewForAdmin' lo adquieran con 'false'.
    // Esto se hace una única vez al cargar el contexto para evitar contadores incorrectos.
    const [orders, setOrders] = useLocalStorage('ecommerceOrders', () => {
        // Mapea los pedidos iniciales para asegurar que tengan la propiedad isNewForAdmin
        // Los pedidos existentes (cargados del JSON o localStorage por primera vez) no son "nuevos"
        return initialOrdersData.map(order => ({
            ...order,
            isNewForAdmin: order.isNewForAdmin !== undefined ? order.isNewForAdmin : false // Si ya existe, usa su valor, si no, es false.
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
            status: "Pendiente", // Nuevo pedido siempre comienza como "Pendiente"
            isNewForAdmin: true, // ¡NUEVA PROPIEDAD! Marcado como nuevo para el admin
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
        return orders.filter(order => order.userId === userId);
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    // Si el estado cambia de "Pendiente" a cualquier otra cosa,
                    // y aún no ha sido marcado como revisado, lo marcamos.
                    // Esto cubre también cambios de estado manuales del admin.
                    const updatedOrder = { ...order, status: newStatus };
                    if (order.status === 'Pendiente' && newStatus !== 'Pendiente' && updatedOrder.isNewForAdmin) {
                        updatedOrder.isNewForAdmin = false;
                    }
                    return updatedOrder;
                }
                return order;
            })
        );
    };

    const deleteOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    };

    // FUNCIÓN MODIFICADA: Ahora solo cuenta pedidos "Pendiente" Y "isNewForAdmin: true"
    const getPendingOrdersCount = () => {
        return orders.filter(order => order.status === 'Pendiente' && order.isNewForAdmin).length;
    };

    // FUNCIÓN MODIFICADA: Al marcar como revisado, cambia a "En Proceso" y `isNewForAdmin` a `false`
    const markOrderAsReviewed = (orderId) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId && order.status === 'Pendiente'
                    ? { ...order, status: 'En Proceso', isNewForAdmin: false } // Cambia el estado y lo marca como revisado
                    : order
            )
        );
    };

    // NUEVA FUNCIÓN PARA LA DEMO: Marcar una orden como pagada (simulación)
    const markOrderAsPaid = (orderId) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'Completado' } // Cambia el estado a "Completado"
                    : order
            )
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
            markOrderAsPaid // <-- Asegúrate de exportar esta nueva función
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => useContext(OrderContext);