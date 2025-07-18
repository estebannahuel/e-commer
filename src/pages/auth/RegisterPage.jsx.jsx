import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importa el contexto de autenticación

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth(); // Obtén la función de registro del AuthContext
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password || !confirmPassword || !email) {
            setError('Por favor, completa todos los campos obligatorios.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setLoading(false);
            return;
        }

        try {
            // Simula un retraso de red
            await new Promise(resolve => setTimeout(resolve, 500)); 

            const result = register({ username, password, email, phone });

            if (result.success) {
                // Registro exitoso y usuario logueado automáticamente
                navigate('/'); // Redirige al inicio
            } else {
                // Mostrar el error específico del registro (ej. usuario ya existe)
                setError(result.message || 'Error al registrar el usuario.');
            }
        } catch (err) {
            setError('Ocurrió un error al intentar registrarse.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center">
            <Card className="shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center mb-4 text-primary fw-bold">
                        <i className="bi bi-person-plus-fill me-2"></i> Registrarse
                    </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="registerUsername">
                            <Form.Label>Nombre de Usuario <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Elige un nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Ingresa tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Label>Contraseña <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Crea tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="confirmPassword">
                            <Form.Label>Confirmar Contraseña <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="registerPhone">
                            <Form.Label>Teléfono (Opcional)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Ingresa tu número de teléfono"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                            />
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100 mb-3 fw-bold py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Registrando...
                                </>
                            ) : (
                                'Crear Cuenta'
                            )}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegisterPage;