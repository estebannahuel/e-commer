// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLoginView, setIsLoginView] = useState(true); // Controla si es vista de login o registro
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // Solo para registro
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Para mensajes de éxito
  const { login, register, isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin', { replace: true }); // Admin va al dashboard
    } else {
      navigate('/', { replace: true }); // Usuario normal va a la homepage
    }
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginView) {
      // Lógica de Login
      if (login(username, password)) {
        // La redirección está en el AuthContext, pero también podemos hacerla aquí
        if (isAdmin) { // Recalcula isAdmin después de un posible login
            navigate('/admin');
        } else {
            navigate('/');
        }
      } else {
        setError('Nombre de usuario o contraseña incorrectos.');
      }
    } else {
      // Lógica de Registro
      if (username && password && phone) {
        if (register(username, password, phone)) {
          setSuccess('¡Registro exitoso! Ya puedes iniciar sesión.');
          setIsLoginView(true); // Cambiar a vista de login
          setUsername('');
          setPassword('');
          setPhone('');
        } else {
          setError('Hubo un problema con el registro. Inténtalo de nuevo.');
        }
      } else {
        setError('Por favor, completa todos los campos.');
      }
    }
  };

  return (
    <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="p-4 shadow-lg border border-primary" style={{ maxWidth: '450px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4 text-primary">{isLoginView ? 'Iniciar Sesión' : 'Registrarse'}</h2>

          <Nav variant="tabs" className="mb-4 justify-content-center">
            <Nav.Item>
              <Nav.Link onClick={() => setIsLoginView(true)} active={isLoginView} className="text-primary">
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setIsLoginView(false)} active={!isLoginView} className="text-primary">
                Registro
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}

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

            {!isLoginView && (
              <Form.Group className="mb-4" controlId="formPhone">
                <Form.Label className="text-secondary">Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Ej: 555-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-light text-dark border-info"
                  required
                />
              </Form.Group>
            )}

            <Button variant="primary" type="submit" className="w-100 shadow-sm">
              {isLoginView ? 'Ingresar' : 'Registrarse'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;