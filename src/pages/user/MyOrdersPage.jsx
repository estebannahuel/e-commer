// src/pages/user/MyOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, ListGroup, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const { user, isAuthenticated } = useAuth();
    const { getUserOrders } = useOrders();
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        if (isAuthenticated && user) {
            setUserOrders(getUserOrders(user.id));
        } else {
            setUserOrders([]);
        }
    }, [isAuthenticated, user, getUserOrders]); // Dependencias: actualizar cuando user o isAuthenticated cambien

    if (!isAuthenticated) {
        return (
            <Container className="my-5 text-center">
                <Alert variant="warning">
                    Debes iniciar sesión para ver tus órdenes. <Link to="/login">Inicia Sesión</Link>
                </Alert>
            </Container>
        );
    }

    if (userOrders.length === 0) {
        return (
            <Container className="my-5 text-center">
                <Alert variant="info">
                    No tienes órdenes registradas. <Link to="/productos">Explora nuestros productos</Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Mis Órdenes</h1>
            {userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => (
                <Card key={order.id} className="mb-4 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                        <h5>Orden ID: {order.id}</h5>
                        <div>
                            <span className={`badge ${
                                order.status === 'Completado' ? 'bg-success' :
                                order.status === 'Pendiente' ? 'bg-warning text-dark' :
                                order.status === 'En Proceso' ? 'bg-info text-dark' :
                                'bg-secondary'
                            }`}>
                                {order.status}
                            </span>
                            <span className="ms-3">Fecha: {order.date}</span>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                            {order.items.map(item => (
                                <ListGroup.Item key={item.productId} className="d-flex justify-content-between">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>${item.price.toFixed(2)}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="text-end mt-3">
                            <h4>Total: ${order.total.toFixed(2)}</h4>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default MyOrdersPage;