import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CheckoutSuccessPage = () => {
    const location = useLocation();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // En una aplicación real, el ID de la orden podría venir de los props de navegación,
        // de un estado global después del checkout, o de un parámetro de URL.
        // Aquí lo simulamos si hay algún dato en el estado de la ubicación.
        if (location.state && location.state.orderId) {
            setOrderId(location.state.orderId);
        } else {
            // Si no hay un orderId en el estado, podemos simular uno o simplemente mostrar un mensaje genérico.
            // Para este ejemplo, solo mostraremos un mensaje genérico si no hay ID.
        }
    }, [location]);

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center">
            <Card className="text-center shadow-lg p-5" style={{ maxWidth: '600px', width: '100%' }}>
                <Card.Body>
                    <i className="bi bi-check-circle-fill text-success mb-4" style={{ fontSize: '6rem' }}></i>
                    <h1 className="mb-3 text-success fw-bold">¡Compra Exitosa!</h1>
                    <p className="lead mb-4 text-secondary">
                        Gracias por tu compra. Tu pedido ha sido procesado correctamente.
                    </p>
                    {orderId && (
                        <Alert variant="info" className="mb-4">
                            Tu número de orden es: <strong className="fs-5">{orderId}</strong>
                        </Alert>
                    )}

                    <div className="d-grid gap-2">
                        <Button as={Link} to="/mis-ordenes" variant="primary" size="lg" className="fw-bold py-2">
                            <i className="bi bi-receipt me-2"></i> Ver Mis Pedidos
                        </Button>
                        <Button as={Link} to="/productos" variant="outline-secondary" size="lg" className="fw-bold py-2">
                            <i className="bi bi-shop me-2"></i> Seguir Comprando
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CheckoutSuccessPage;