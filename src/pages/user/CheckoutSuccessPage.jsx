// src/pages/user/CheckoutSuccessPage.jsx
import React, { useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CheckoutSuccessPage = () => {
    const location = useLocation();
    // Obtiene el ID de la orden de la navegación (pasado por FakePaymentGateway)
    const orderId = location.state?.orderId;

    useEffect(() => {
        // Puedes agregar lógica adicional aquí si es necesario,
        // por ejemplo, para enviar una confirmación por correo electrónico (simulada)
    }, []);

    return (
        <Container className="my-5 p-4 rounded shadow-sm bg-white text-center">
            <Alert variant="success">
                <h2 className="alert-heading">¡Compra Exitosa!</h2>
                <p>Tu pedido ha sido procesado correctamente.</p>
                {orderId && <p><strong>Número de Orden:</strong> {orderId}</p>}
                <hr />
                <p>Gracias por tu compra. Te notificaremos cuando tu pedido sea enviado.</p>
                <Link to="/productos">
                    <Button variant="success">
                        <i className="bi bi-shop me-2"></i> Seguir Comprando
                    </Button>
                </Link>
                <Link to="/mis-ordenes" className="ms-2">
                    <Button variant="outline-success">
                        <i className="bi bi-receipt-cutoff me-2"></i> Ver Mis Órdenes
                    </Button>
                </Link>
            </Alert>
        </Container>
    );
};

export default CheckoutSuccessPage;