// src/pages/user/UserProfilePage.jsx
import React from 'react';
import { Container, Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import { useProducts } from '../../contexts/ProductContext'; // Para obtener detalles de productos si es necesario

const UserProfilePage = () => {
    const { user, isAuthenticated } = useAuth();
    const { getUserOrders } = useOrders();
    const { products } = useProducts(); // Aunque no se usa directamente en este ejemplo, es útil tenerlo

    // Si el usuario no está autenticado o no hay datos de usuario, redirigir o mostrar mensaje
    if (!isAuthenticated || !user) {
        return (
            <Container className="my-5 text-center">
                <h2>Necesitas iniciar sesión para ver tu perfil.</h2>
                <p>Por favor, <Link to="/login">inicia sesión</Link> o <Link to="/register">regístrate</Link>.</p>
            </Container>
        );
    }

    // Obtener las órdenes del usuario logueado
    const userOrders = getUserOrders(user.id);

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-person-circle me-3"></i> Mi Perfil ({user.username})
                </h1>
                <p className="lead text-secondary text-center mb-5">
                    Aquí puedes ver la información de tu cuenta y el historial de tus compras.
                </p>

                <Row className="mb-5">
                    <Col md={6}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-primary text-white fs-5">
                                <i className="bi bi-info-circle me-2"></i> Información de la Cuenta
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>ID de Usuario:</strong> {user.id}</ListGroup.Item>
                                    <ListGroup.Item><strong>Nombre de Usuario:</strong> {user.username}</ListGroup.Item>
                                    <ListGroup.Item><strong>Rol:</strong> {user.role}</ListGroup.Item>
                                    <ListGroup.Item><strong>Teléfono:</strong> {user.phone || 'N/A'}</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-success text-white fs-5">
                                <i className="bi bi-bag-check me-2"></i> Mis Compras
                            </Card.Header>
                            <Card.Body>
                                {userOrders.length > 0 ? (
                                    <ListGroup variant="flush">
                                        {userOrders.map(order => (
                                            <ListGroup.Item key={order.id} className="d-flex justify-content-between align-items-center flex-wrap">
                                                <div>
                                                    <strong>Orden #{order.id}</strong> ({order.date}) - Total: ${order.total.toFixed(2)}
                                                    <div className="mt-1">
                                                        <small className="text-muted">Estado: <Badge bg={order.status === "Completado" ? "success" : "warning"}>{order.status}</Badge></small>
                                                    </div>
                                                    <ul className="list-unstyled mt-2 mb-0">
                                                        {order.items.map((item, index) => (
                                                            <li key={index}>
                                                                {item.name} (x{item.quantity}) - ${item.price.toFixed(2)} c/u
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-center text-muted">Aún no has realizado ninguna compra.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-info text-white fs-5">
                                <i className="bi bi-star-fill me-2"></i> Mis Valoraciones de Productos
                            </Card.Header>
                            <Card.Body>
                                <p className="text-center text-muted">
                                    Esta sección está preparada para ser expandida si decides implementar un sistema de reseñas más detallado por usuario.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default UserProfilePage;