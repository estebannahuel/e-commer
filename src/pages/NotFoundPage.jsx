// src/pages/NotFoundPage.jsx
import React from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="text-center p-5 rounded shadow-lg border border-warning bg-white">
        <h1 className="display-1 fw-bold text-warning">404</h1>
        <h2 className="mb-4 text-primary">¡Oops! Página No Encontrada</h2>
        <p className="lead text-secondary mb-4">
          Parece que la página que buscas no existe o se ha movido.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            <i className="bi bi-house-door-fill me-2"></i> Volver al Inicio
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;