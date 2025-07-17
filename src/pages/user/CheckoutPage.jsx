// src/pages/user/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../contexts/OrderContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import FakePaymentGateway from '../../components/FakePaymentGateway'; // Importa el simulador

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { placeOrder } = useOrders();
    const { user, isAuthenticated } = useAuth(); // Asegúrate de tener user e isAuthenticated
    const navigate = useNavigate();

    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);

    // Redirige al carrito si no hay items, a menos que ya estemos en el proceso de pago
    // (es decir, currentOrderId ya tiene un valor, lo que indica que una orden fue creada
    // y el carrito ya se vació).
    useEffect(() => {
        if (cartItems.length === 0 && !currentOrderId && !showPaymentGateway) {
            navigate('/carrito');
        }
    }, [cartItems, currentOrderId, showPaymentGateway, navigate]); // Dependencias correctas

    // Función para manejar el inicio del proceso de pago
    const handleProceedToPayment = () => {
        if (!isAuthenticated) {
            setCheckoutError("Debes iniciar sesión para completar la compra.");
            return;
        }
        if (cartItems.length === 0) {
            setCheckoutError("Tu carrito está vacío. Añade productos para continuar.");
            return;
        }

        // Crear la orden en el OrderContext con estado "Pendiente"
        const newOrder = placeOrder(cartItems, getCartTotal());
        if (newOrder) {
            setCurrentOrderId(newOrder.id);
            setShowPaymentGateway(true); // Mostrar el componente de la pasarela simulada
            setCheckoutError(null);
            clearCart(); // Limpia el carrito inmediatamente después de "crear la orden"
                         // La orden ya está guardada en OrderContext
        } else {
            setCheckoutError("No se pudo crear la orden. Intenta de nuevo.");
        }
    };

    return (
        <Container className="my-5 p-4 rounded shadow-sm bg-white">
            <h1 className="text-center mb-4 text-primary">Finalizar Compra</h1>

            {checkoutError && <Alert variant="danger">{checkoutError}</Alert>}

            {!showPaymentGateway ? (
                <>
                    <h4 className="mb-3">Resumen de tu Pedido:</h4>
                    <ListGroup variant="flush" className="mb-4">
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    {item.name} <span className="text-muted">(x{item.quantity})</span>
                                </div>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Row className="mb-4">
                        <Col className="text-end">
                            <h3>Total: <strong>${getCartTotal().toFixed(2)}</strong></h3>
                        </Col>
                    </Row>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" onClick={handleProceedToPayment} disabled={cartItems.length === 0 || !isAuthenticated}>
                            Proceder al Pago
                        </Button>
                    </div>
                </>
            ) : (
                // Muestra la pasarela de pago cuando se procede al pago
                <Row className="justify-content-center">
                    <Col md={6}>
                        <FakePaymentGateway
                            orderId={currentOrderId}
                            total={getCartTotal()} // Usa el total del carrito para la pasarela
                        />
                    </Col>
                </Row>
            )}
            {/* Si el carrito está vacío y no hay una orden en proceso (después de redirección inicial) */}
            {cartItems.length === 0 && !currentOrderId && (
                <Alert variant="info" className="mt-4 text-center">
                    Tu carrito está vacío. <Button variant="link" onClick={() => navigate('/productos')}>Ir a la tienda</Button>
                </Alert>
            )}
        </Container>
    );
};

export default CheckoutPage;