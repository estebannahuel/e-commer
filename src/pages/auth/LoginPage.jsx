// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'; // Eliminamos Nav porque ya no hay pestañas aquí
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
    return null; // No renderiza nada si ya está autenticado
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpia errores previos

    if (login(username, password)) {
      // La redirección es manejada por el AuthContext en la mayoría de los casos
      // o por la verificación de isAuthenticated al inicio de este componente.
      // Puedes dejar un console.log o un mensaje de éxito si lo deseas.
      console.log('Inicio de sesión exitoso.');
    } else {
      setError('Nombre de usuario o contraseña incorrectos.');
    }
  };

  return (
    <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="p-4 shadow-lg border border-primary" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">Iniciar Sesión</h2>

          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label className="text-secondary">Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-light text-dark border-info"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label className="text-secondary">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-light text-dark border-info"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 shadow-sm">
              Ingresar
            </Button>
          </Form>
            <div className="mt-3 text-center">
                ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;