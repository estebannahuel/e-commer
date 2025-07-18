import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Badge, Alert, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'; // Para obtener el usuario logeado
import { useOrders } from '../contexts/OrderContext'; // Para obtener y gestionar notificaciones

const UserNotifications = ({ show, handleClose }) => {
    const { user } = useAuth(); // Obtener el usuario actualmente logeado
    // MODIFICADO: Usar getUserNotifications y markNotificationAsRead del OrderContext
    const { getUserNotifications, markNotificationAsRead } = useOrders();

    const [userNotifications, setUserNotifications] = useState([]);

    // Efecto para cargar las notificaciones del usuario actual
    useEffect(() => {
        if (user) {
            setUserNotifications(getUserNotifications(user.id));
        } else {
            setUserNotifications([]); // Limpiar notificaciones si no hay usuario logeado
        }
    }, [user, getUserNotifications]); // Depende de 'user' y de la función 'getUserNotifications'

    const handleMarkAsRead = (notificationId) => {
        markNotificationAsRead(notificationId);
        // Actualizar el estado local para reflejar el cambio inmediatamente
        setUserNotifications(prevNotifications =>
            prevNotifications.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
    };

    const unreadNotificationsCount = userNotifications.filter(notif => !notif.read).length;

    // Determina el color de la insignia según el tipo de notificación
    const getBadgeVariant = (type) => {
        switch (type) {
            case 'success': return 'success';
            case 'danger': return 'danger';
            case 'warning': return 'warning';
            default: return 'info';
        }
    };

    if (!user) {
        return null; // No mostrar el modal si no hay usuario logeado
    }

    return (
        // Usamos Offcanvas para un diseño moderno, tipo panel lateral
        <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="fs-4 fw-bold">
                    <i className="bi bi-bell-fill me-2"></i> Tus Notificaciones
                    {unreadNotificationsCount > 0 && (
                        <Badge bg="danger" className="ms-2 fs-6">
                            {unreadNotificationsCount} sin leer
                        </Badge>
                    )}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {userNotifications.length === 0 ? (
                    <Alert variant="info" className="text-center mt-3">
                        No tienes notificaciones por el momento.
                    </Alert>
                ) : (
                    <ListGroup className="notification-list">
                        {userNotifications.map(notification => (
                            <ListGroup.Item
                                key={notification.id}
                                action // Permite que el elemento sea clickeable
                                onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                className={`d-flex justify-content-between align-items-start mb-2 rounded-3 ${notification.read ? 'bg-light text-muted' : 'bg-white shadow-sm border border-primary'}`}
                                style={{ cursor: notification.read ? 'default' : 'pointer' }}
                            >
                                <div className="flex-grow-1">
                                    <p className="mb-1 fw-semibold d-flex align-items-center">
                                        <Badge bg={getBadgeVariant(notification.type)} className="me-2 text-uppercase fw-normal">
                                            {notification.type}
                                        </Badge>
                                        {notification.message}
                                    </p>
                                    <small className="text-muted">
                                        {new Date(notification.timestamp).toLocaleString()}
                                        {notification.relatedOrderId && (
                                            <span className="ms-2">
                                                (Orden: {notification.relatedOrderId})
                                            </span>
                                        )}
                                    </small>
                                </div>
                                {!notification.read && (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="ms-3"
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        Marcar como leído
                                    </Button>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default UserNotifications;