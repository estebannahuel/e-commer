import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importa el contexto de autenticación

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Obtén la función de login del AuthContext
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Por favor, ingresa tu nombre de usuario y contraseña.');
            setLoading(false);
            return;
        }

        try {
            // Simula un retraso de red para la experiencia de usuario
            await new Promise(resolve => setTimeout(resolve, 500)); 

            const success = login(username, password);

            if (success) {
                navigate('/'); // Redirige al inicio o a la página anterior
            } else {
                setError('Nombre de usuario o contraseña incorrectos.');
            }
        } catch (err) {
            setError('Ocurrió un error al intentar iniciar sesión.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center">
            <Card className="shadow-lg p-4" style={{ maxWidth: '450px', width: '100%' }}>
                <Card.Body>
                    <h2 className="text-center mb-4 text-primary fw-bold">
                        <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
                    </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Nombre de Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3 fw-bold py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Iniciando Sesión...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;