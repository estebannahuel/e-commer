import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserOrdersPage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && user.id) {
                setLoading(true);
                setError('');
                try {
                    // En una aplicación real, aquí harías una llamada a tu API
                    // para obtener los pedidos del usuario.
                    // Por ahora, simularemos con datos de ejemplo o un filtro de un array global
                    // Si tus 'users.json' o 'db.json' tienen un array de 'orders' por usuario:
                    // const response = await fetch(`/api/users/${user.id}/orders`);
                    // const data = await response.json();
                    // setOrders(data);

                    // Simulación: Asumiendo que el objeto 'user' en el contexto
                    // podría tener una propiedad 'orders' (array de objetos de pedido)
                    // O que tenemos un array global de pedidos y los filtramos por userId
                    if (user.orders && Array.isArray(user.orders)) {
                        setOrders(user.orders);
                    } else {
                        // Si no hay 'orders' en el objeto user, o no es un array
                        setOrders([]);
                    }
                } catch (err) {
                    console.error("Error fetching user orders:", err);
                    setError('Error al cargar tus pedidos. Inténtalo de nuevo más tarde.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // No hay usuario, no hay pedidos que cargar
            }
        };

        fetchOrders();
    }, [user]); // Dependencia del usuario para recargar si cambia

    if (loading) {
        return (
            <Container className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando pedidos...</span>
                </div>
                <p className="mt-2">Cargando historial de pedidos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">{error}</Alert>
                <Button variant="primary" onClick={() => navigate('/')}>Volver al Inicio</Button>
            </Container>
        );
    }

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-receipt me-3"></i> Mis Órdenes
                </h1>
                <p className="lead text-secondary text-center mb-5">
                    Aquí puedes ver el historial de tus compras.
                </p>

                {orders.length === 0 ? (
                    <Alert variant="info" className="text-center">
                        No tienes pedidos realizados aún. ¡Explora nuestros productos!
                        <div className="mt-3">
                            <Button variant="primary" onClick={() => navigate('/productos')}>
                                Ir a Productos
                            </Button>
                        </div>
                    </Alert>
                ) : (
                    <Row className="justify-content-center g-4">
                        {orders.map(order => (
                            <Col md={10} key={order.id}>
                                <Card className="shadow-sm border-0 mb-3">
                                    <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                                        <span>Orden #{order.id}</span>
                                        <Badge bg={order.status === 'Completado' ? 'success' : 'warning'}>
                                            {order.status}
                                        </Badge>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title className="mb-3">Fecha: {new Date(order.date).toLocaleDateString()}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Total: ${order.total.toFixed(2)}</Card.Subtitle>
                                        <hr />
                                        <h6 className="mb-3">Artículos:</h6>
                                        <ListGroup variant="flush">
                                            {order.items.map(item => (
                                                <ListGroup.Item key={item.productId} className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{item.name}</strong>
                                                        <span className="text-muted ms-2">x {item.quantity}</span>
                                                    </div>
                                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                    <Card.Footer className="text-end">
                                        <Button variant="outline-primary" size="sm" onClick={() => alert(`Ver detalles de la orden ${order.id}`)}>
                                            Ver Detalles
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </Container>
    );
};

export default UserOrdersPage;