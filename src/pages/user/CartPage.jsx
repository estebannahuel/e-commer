// src/pages/user/CartPage.jsx
import React from 'react';
import { Container, Row, Col, Button, ListGroup, Image, Alert, Form } from 'react-bootstrap';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
// import { useOrders } from '../../contexts/OrderContext'; // Esta línea ya no es necesaria
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeItemFromCart, updateItemQuantity, clearCart, getCartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    // const { placeOrder } = useOrders(); // Este hook ya no es necesario aquí
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        if (!isAuthenticated) {
            alert("Debes iniciar sesión para finalizar la compra.");
            navigate('/login'); // Redirige al login si no está autenticado
            return;
        }

        // **IMPORTANTE**: Ahora solo redirigimos a la página de checkout.
        // La lógica de crear la orden y limpiar el carrito se manejará en CheckoutPage.
        navigate('/checkout');
    };

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-cart-fill me-3"></i> Tu Carrito
                </h1>

                {cartItems.length === 0 ? (
                    <Alert variant="info" className="text-center shadow-sm py-4">
                        <h4 className="alert-heading"><i className="bi bi-info-circle-fill me-2"></i> Tu carrito está vacío</h4>
                        <p className="mb-0">¡Empieza a llenarlo con nuestros increíbles productos!</p>
                        <hr />
                        <Link to="/productos" className="btn btn-primary">Ir a Productos</Link>
                    </Alert>
                ) : (
                    <>
                        <ListGroup variant="flush" className="mb-4">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.id} className="d-flex align-items-center py-3">
                                    <Image src={item.image || 'https://via.placeholder.com/50x50?text=No+Image'} thumbnail style={{ width: '80px', height: '80px', objectFit: 'cover' }} className="me-3" />
                                    <div className="flex-grow-1">
                                        <h5>{item.name}</h5>
                                        <p className="text-secondary mb-1">${item.price.toFixed(2)} c/u</p>
                                    </div>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                        style={{ width: '70px' }}
                                        className="me-3"
                                    />
                                    <span className="fw-bold fs-5 me-3">${(item.price * item.quantity).toFixed(2)}</span>
                                    <Button variant="danger" size="sm" onClick={() => removeItemFromCart(item.id)}>
                                        <i className="bi bi-trash-fill"></i>
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <Row className="justify-content-end mb-4">
                            <Col xs={12} md={4} className="text-end">
                                <h3 className="text-primary">Total: ${getCartTotal().toFixed(2)}</h3>
                            </Col>
                        </Row>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button variant="outline-danger" onClick={clearCart} className="me-md-2">
                                <i className="bi bi-trash-fill me-2"></i> Vaciar Carrito
                            </Button>
                            <Button variant="success" onClick={handleCheckout}>
                                <i className="bi bi-bag-check-fill me-2"></i> Realizar Compra
                            </Button>
                        </div>
                    </>
                )}
            </Container>
        </Container>
    );
};

export default CartPage;