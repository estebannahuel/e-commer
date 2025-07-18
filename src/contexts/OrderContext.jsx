import React, { createContext, useContext, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import ordersData from '../data/orders.json';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useLocalStorage('ecommerceOrders', ordersData);
    // NUEVA LÍNEA: Estado para las notificaciones
    const [notifications, setNotifications] = useLocalStorage('ecommerceNotifications', []);

    // NUEVA FUNCIÓN: Para añadir una notificación
    const addNotification = useCallback((userId, message, type = 'info', relatedOrderId = null) => {
        const newNotification = {
            id: `NOTIF${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID único
            userId: userId,
            message: message,
            type: type, // 'info', 'success', 'warning', 'danger'
            read: false,
            timestamp: new Date().toISOString(),
            relatedOrderId: relatedOrderId // Opcional: para enlazar a una orden
        };
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
    }, [setNotifications]);

    // Función para agregar una nueva orden
    const addOrder = useCallback((userId, cartItems, shippingInfo, paymentMethod) => {
        const newOrderId = `ORD${Date.now()}`;
        const orderDate = new Date().toISOString().slice(0, 10);

        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        const newOrder = {
            id: newOrderId,
            userId: userId,
            date: orderDate,
            status: 'Pendiente', // Estado inicial de la orden
            items: cartItems.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            shippingInfo: shippingInfo,
            paymentMethod: paymentMethod,
            total: total
        };

        setOrders(prevOrders => [...prevOrders, newOrder]);
        // MODIFICADO: Añadir notificación al crear la orden
        addNotification(userId, `Tu orden #${newOrderId} ha sido creada y está Pendiente.`, 'info', newOrderId);
        return newOrderId;
    }, [setOrders, addNotification]); // Dependencia addNotification

    // Función para obtener las órdenes de un usuario específico
    const getUserOrders = useCallback((userId) => {
        return orders.filter(order => order.userId === userId);
    }, [orders]);

    // Función para obtener todas las órdenes (útil para el admin)
    const getAllOrders = useCallback(() => {
        return orders;
    }, [orders]);

    // MODIFICADA: updateOrderStatus ahora también envía una notificación
    const updateOrderStatus = useCallback((orderId, newStatus) => {
        let updatedUserId = null; // Para guardar el userId de la orden actualizada
        setOrders(prevOrders => {
            return prevOrders.map(order => {
                if (order.id === orderId) {
                    updatedUserId = order.userId; // Capturar el userId
                    // Definir el tipo de notificación basado en el estado
                    let notificationType = 'info';
                    let notificationMessage = `El estado de tu orden #${order.id} ha cambiado a: ${newStatus}.`;

                    if (newStatus === 'Enviado') {
                        notificationType = 'success';
                        notificationMessage = `¡Tu orden #${order.id} ha sido enviada!`;
                    } else if (newStatus === 'Completado') {
                        notificationType = 'success';
                        notificationMessage = `¡Tu orden #${order.id} ha sido entregada y completada!`;
                    } else if (newStatus === 'Cancelado') {
                        notificationType = 'danger';
                        notificationMessage = `Tu orden #${order.id} ha sido cancelada.`;
                    }

                    // Asegurarse de que el userId esté disponible para la notificación
                    // y que addNotification esté disponible en las dependencias de useCallback
                    addNotification(updatedUserId, notificationMessage, notificationType, order.id);
                    return { ...order, status: newStatus };
                }
                return order;
            });
        });
    }, [setOrders, addNotification]); // Dependencia addNotification

    // NUEVA FUNCIÓN: Para marcar una notificación como leída
    const markNotificationAsRead = useCallback((notificationId) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
    }, [setNotifications]);

    // NUEVA FUNCIÓN: Para obtener las notificaciones de un usuario
    const getUserNotifications = useCallback((userId) => {
        return notifications.filter(notif => notif.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }, [notifications]);

    // MODIFICADO: Añadir nuevas funciones y estado al value del contexto
    const value = {
        orders,
        addOrder,
        getUserOrders,
        getAllOrders,
        updateOrderStatus,
        notifications, // EXPOSED: Todas las notificaciones
        addNotification, // EXPOSED: Función para añadir notificaciones manualmente (si fuera necesario)
        markNotificationAsRead, // EXPOSED: Función para marcar como leída
        getUserNotifications // EXPOSED: Función para obtener notificaciones por usuario
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};