import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // Importa el contexto del carrito

const CartPage = () => {
    const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const handleProceedToCheckout = () => {
        navigate('/checkout');
    };

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-cart-fill me-3"></i> Mi Carrito de Compras
                </h1>
                <p className="lead text-secondary text-center mb-5">
                    Revisa los productos que has añadido y finaliza tu compra.
                </p>

                {cartItems.length === 0 ? (
                    <Alert variant="info" className="text-center py-4">
                        <h4 className="alert-heading"><i className="bi bi-info-circle-fill me-2"></i> Tu carrito está vacío</h4>
                        <p className="mb-0">¡Parece que aún no has añadido ningún producto! Explora nuestra <Link to="/productos">tienda</Link> y encuentra algo que te guste.</p>
                    </Alert>
                ) : (
                    <Row>
                        <Col lg={8}>
                            <Card className="shadow-sm border-0">
                                <Card.Header className="bg-primary text-white fs-5">
                                    Productos en el Carrito
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {cartItems.map(item => (
                                        <ListGroup.Item key={item.id} className="d-flex align-items-center py-3">
                                            <img
                                                src={item.image || '/images/placeholder.jpg'}
                                                alt={item.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                className="me-3 border"
                                            />
                                            <div className="flex-grow-1">
                                                <h5 className="mb-1">
                                                    <Link to={`/producto/${item.id}`} className="text-dark text-decoration-none hover-link-primary">
                                                        {item.name}
                                                    </Link>
                                                </h5>
                                                <p className="text-muted mb-0">Precio: ${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="d-flex align-items-center me-3">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="me-2"
                                                >
                                                    -
                                                </Button>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                    min="1"
                                                    style={{ width: '60px', textAlign: 'center' }}
                                                />
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="ms-2"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            <div className="text-end me-3">
                                                <h5 className="mb-0 text-success">${(item.price * item.quantity).toFixed(2)}</h5>
                                            </div>
                                            <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                <Card.Footer className="d-flex justify-content-between align-items-center bg-light">
                                    <Button variant="outline-danger" onClick={clearCart}>
                                        <i className="bi bi-x-circle me-2"></i> Vaciar Carrito
                                    </Button>
                                    <Link to="/productos">
                                        <Button variant="outline-secondary">
                                            <i className="bi bi-arrow-left me-2"></i> Seguir Comprando
                                        </Button>
                                    </Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="shadow-sm border-0 mt-4 mt-lg-0 sticky-top" style={{ top: '20px' }}>
                                <Card.Header className="bg-success text-white fs-5">
                                    Resumen de la Compra
                                </Card.Header>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center fs-5 fw-bold text-primary">
                                            Total: <span>${cartTotal.toFixed(2)}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Button
                                        variant="warning"
                                        className="w-100 mt-4 py-2 fw-bold fs-5"
                                        onClick={handleProceedToCheckout}
                                        disabled={cartItems.length === 0}
                                    >
                                        <i className="bi bi-bag-check-fill me-2"></i> Proceder al Pago
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
};

export default CartPage;