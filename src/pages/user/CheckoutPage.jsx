import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';
import FakePaymentGateway from '../../components/FakePaymentGateway'; // Importa la pasarela de pago simulada

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { addOrder } = useOrders();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('creditCard'); // Default payment method
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

    // Redirigir si el carrito está vacío o el usuario no está autenticado
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/carrito');
            // Opcional: mostrar un mensaje al usuario
            // alert('Tu carrito está vacío. Añade productos antes de proceder al pago.');
        }
        if (!isAuthenticated) {
            navigate('/login');
            // alert('Debes iniciar sesión para proceder al pago.');
        }
        // precargar la dirección del usuario si existe
        if (user) {
            setShippingAddress(user.address || '');
            setCity(user.city || ''); // Asumiendo que el usuario puede tener city/country en su perfil
            setCountry(user.country || '');
        }
    }, [cartItems, isAuthenticated, navigate, user]);

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!shippingAddress || !city || !postalCode || !country) {
            setError('Por favor, completa todos los campos de envío.');
            return;
        }
        setStep(2); // Pasar al paso de pago
    };

    const handlePaymentSuccess = (paymentDetails) => {
        if (!user) {
            setError('Error: No se encontró la información del usuario.');
            return;
        }

        const shippingInfo = { shippingAddress, city, postalCode, country };
        // Crear la orden
        addOrder(user.id, cartItems, shippingInfo, paymentMethod);

        clearCart(); // Vaciar el carrito después de una compra exitosa
        navigate('/checkout/success'); // Redirigir a la página de éxito
    };

    const handlePaymentError = (errorMessage) => {
        setError(`Error en el pago: ${errorMessage}`);
    };

    if (cartItems.length === 0 || !isAuthenticated) {
        return null; // O un spinner/mensaje de carga mientras redirige
    }

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-credit-card-2-front-fill me-3"></i> Finalizar Compra
                </h1>
                <p className="lead text-secondary text-center mb-5">
                    Completa tus datos de envío y pago para confirmar tu pedido.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-dark text-white fs-5 d-flex justify-content-between align-items-center">
                                <span>Paso {step} de 2: {step === 1 ? 'Información de Envío' : 'Seleccionar Método de Pago'}</span>
                                {step === 2 && (
                                    <Button variant="outline-light" size="sm" onClick={() => setStep(1)}>
                                        <i className="bi bi-arrow-left me-2"></i> Volver a Envío
                                    </Button>
                                )}
                            </Card.Header>
                            <Card.Body>
                                {step === 1 && (
                                    <Form onSubmit={handleShippingSubmit}>
                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group controlId="shippingAddress" className="mb-3">
                                                    <Form.Label>Dirección de Envío</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Calle, número, departamento..."
                                                        value={shippingAddress}
                                                        onChange={(e) => setShippingAddress(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="city" className="mb-3">
                                                    <Form.Label>Ciudad</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ciudad"
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="postalCode" className="mb-3">
                                                    <Form.Label>Código Postal</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Código Postal"
                                                        value={postalCode}
                                                        onChange={(e) => setPostalCode(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group controlId="country" className="mb-3">
                                                    <Form.Label>País</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="País"
                                                        value={country}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Button variant="primary" type="submit" className="w-100 py-2 fw-bold">
                                            Continuar al Pago <i className="bi bi-arrow-right ms-2"></i>
                                        </Button>
                                    </Form>
                                )}

                                {step === 2 && (
                                    <>
                                        <h5 className="mb-3 text-secondary">Productos en tu orden:</h5>
                                        <ListGroup className="mb-4">
                                            {cartItems.map(item => (
                                                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                                    {item.name} (x{item.quantity})
                                                    <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                                </ListGroup.Item>
                                            ))}
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light fw-bold fs-5 text-primary">
                                                Total: <span>${cartTotal.toFixed(2)}</span>
                                            </ListGroup.Item>
                                        </ListGroup>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="fs-5">Método de Pago:</Form.Label>
                                            <div className="d-flex gap-3">
                                                <Form.Check
                                                    type="radio"
                                                    id="creditCard"
                                                    label={<><i className="bi bi-credit-card-fill me-2"></i> Tarjeta de Crédito</>}
                                                    name="paymentMethod"
                                                    value="creditCard"
                                                    checked={paymentMethod === 'creditCard'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    inline
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id="paypal"
                                                    label={<><i className="bi bi-paypal me-2"></i> PayPal</>}
                                                    name="paymentMethod"
                                                    value="paypal"
                                                    checked={paymentMethod === 'paypal'}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    inline
                                                    disabled // Deshabilita PayPal por ahora (solo se simula tarjeta)
                                                />
                                            </div>
                                        </Form.Group>

                                        {paymentMethod === 'creditCard' && (
                                            <FakePaymentGateway
                                                onPaymentSuccess={handlePaymentSuccess}
                                                onPaymentError={handlePaymentError}
                                                total={cartTotal}
                                            />
                                        )}
                                        {paymentMethod === 'paypal' && (
                                            <Alert variant="info" className="text-center">
                                                La integración con PayPal es una funcionalidad futura.
                                                Por favor, selecciona Tarjeta de Crédito.
                                            </Alert>
                                        )}
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default CheckoutPage;