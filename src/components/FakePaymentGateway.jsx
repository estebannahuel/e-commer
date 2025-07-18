import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

const FakePaymentGateway = ({ onPaymentSuccess, onPaymentError, total }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        // Simple validaciones de formato
        if (!cardNumber || !cardName || !expiryDate || !cvv) {
            setError('Por favor, completa todos los campos de la tarjeta.');
            setProcessing(false);
            return;
        }
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            setError('Número de tarjeta inválido. Debe tener 16 dígitos.');
            setProcessing(false);
            return;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            setError('Fecha de vencimiento inválida. Formato MM/AA.');
            setProcessing(false);
            return;
        }
        if (!/^\d{3,4}$/.test(cvv)) {
            setError('CVV inválido. Debe tener 3 o 4 dígitos.');
            setProcessing(false);
            return;
        }

        // Simulación de un procesamiento de pago asíncrono
        setTimeout(() => {
            // En un escenario real, aquí se enviarían los datos a un backend seguro
            // y se recibiría una respuesta del proveedor de pagos.

            // Simulación de éxito o error aleatorio (o basado en alguna lógica de test)
            const isSuccess = Math.random() > 0.1; // 90% de éxito, 10% de fallo

            if (isSuccess) {
                onPaymentSuccess({
                    transactionId: `TXN-${Date.now()}`,
                    amount: total,
                    paymentMethod: 'Credit Card (Simulated)'
                });
            } else {
                setError('Error en el procesamiento del pago. Inténtalo de nuevo.');
                onPaymentError('Payment simulation failed.');
            }
            setProcessing(false);
        }, 2000); // Simula 2 segundos de procesamiento
    };

    // Función para formatear el número de tarjeta (espacios cada 4 dígitos)
    const formatCardNumber = (value) => {
        const cleanedValue = value.replace(/\s/g, '').slice(0, 16);
        const parts = [];
        for (let i = 0; i < cleanedValue.length; i += 4) {
            parts.push(cleanedValue.substring(i, i + 4));
        }
        return parts.join(' ');
    };

    // Función para formatear la fecha de vencimiento (MM/AA)
    const formatExpiryDate = (value) => {
        const cleanedValue = value.replace(/\D/g, '').slice(0, 4);
        if (cleanedValue.length > 2) {
            return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`;
        }
        return cleanedValue;
    };

    return (
        <div className="p-4 border rounded shadow-sm bg-light">
            <h4 className="mb-4 text-center text-primary">Detalles de Pago</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="cardNumber">
                    <Form.Label>Número de Tarjeta</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={formatCardNumber(cardNumber)}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength="19" // 16 dígitos + 3 espacios
                        required
                        disabled={processing}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cardName">
                    <Form.Label>Nombre en la Tarjeta</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nombre Completo"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        disabled={processing}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="expiryDate">
                            <Form.Label>Fecha de Vencimiento (MM/AA)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="MM/AA"
                                value={formatExpiryDate(expiryDate)}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                maxLength="5" // MM/AA
                                required
                                disabled={processing}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="cvv">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="XXX"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Solo números
                                maxLength="4"
                                required
                                disabled={processing}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button
                    variant="success"
                    type="submit"
                    className="w-100 mt-3"
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Procesando Pago...
                        </>
                    ) : (
                        `Pagar $${total.toFixed(2)}`
                    )}
                </Button>
            </Form>
        </div>
    );
};

export default FakePaymentGateway;