// src/components/FakePaymentGateway.jsx
import React, { useState } from 'react';
import { Card, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';

const FakePaymentGateway = ({ orderId, total }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [paymentMethodSelected, setPaymentMethodSelected] = useState(null);

    const navigate = useNavigate();
    const { markOrderAsPaid } = useOrders(); // Usamos markOrderAsPaid

    const handleSimulatePayment = async (method) => {
        if (loading) return;

        setLoading(true);
        setSuccess(false);
        setMessage('');
        setPaymentMethodSelected(method);

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Llama a la función del OrderContext para marcar la orden como PAGADA (no completada)
            markOrderAsPaid(orderId);
            setSuccess(true);
            setMessage(`¡Pago simulado con ${method} exitoso!`);

            // Redirige al usuario a una página de confirmación de pago
            setTimeout(() => {
                navigate('/checkout/success', { state: { orderId: orderId, status: 'Pagado' } });
            }, 1000);

        } catch (err) {
            setMessage('Hubo un error al simular el pago. Inténtalo de nuevo.');
            console.error("Error al simular pago:", err);
            setSuccess(false);
        } finally {
            setLoading(false);
            setPaymentMethodSelected(null);
        }
    };

    return (
        <Card className="p-4 shadow-sm">
            <h4 className="mb-4 text-center">Selecciona un Método de Pago (Demo)</h4>
            <p className="text-center text-muted">Total a Pagar: <strong>${total.toFixed(2)}</strong></p>

            {message && (
                <Alert variant={success ? "success" : "danger"} className="mt-3 text-center">
                    {message}
                </Alert>
            )}

            <ListGroup className="mt-3 mb-4">
                <ListGroup.Item action onClick={() => handleSimulatePayment('Tarjeta de Crédito')} disabled={loading}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-credit-card-fill me-2"></i> Tarjeta de Crédito</span>
                        {loading && paymentMethodSelected === 'Tarjeta de Crédito' && (
                             <Spinner animation="border" size="sm" role="status" className="text-primary">
                                 <span className="visually-hidden">Cargando...</span>
                             </Spinner>
                        )}
                        {!loading && paymentMethodSelected !== 'Tarjeta de Crédito' && <i className="bi bi-chevron-right"></i>}
                    </div>
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => handleSimulatePayment('PayPal')} disabled={loading}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-paypal me-2"></i> PayPal</span>
                        {loading && paymentMethodSelected === 'PayPal' && (
                             <Spinner animation="border" size="sm" role="status" className="text-primary">
                                 <span className="visually-hidden">Cargando...</span>
                             </Spinner>
                        )}
                        {!loading && paymentMethodSelected !== 'PayPal' && <i className="bi bi-chevron-right"></i>}
                    </div>
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => handleSimulatePayment('Transferencia Bancaria')} disabled={loading}>
                    <div className="d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-bank-fill me-2"></i> Transferencia Bancaria</span>
                        {loading && paymentMethodSelected === 'Transferencia Bancaria' && (
                             <Spinner animation="border" size="sm" role="status" className="text-primary">
                                 <span className="visually-hidden">Cargando...</span>
                             </Spinner>
                        )}
                        {!loading && paymentMethodSelected !== 'Transferencia Bancaria' && <i className="bi bi-chevron-right"></i>}
                    </div>
                </ListGroup.Item>
                {/* Puedes añadir más métodos de pago simulados aquí */}
            </ListGroup>

            <p className="text-muted text-center mt-3">
                *Esto es un simulador de pasarela de pago para fines de demostración. No se procesarán transacciones reales.
            </p>
        </Card>
    );
};

export default FakePaymentGateway;