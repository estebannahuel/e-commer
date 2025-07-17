// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { getTotalItems } = useCart();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <i className="bi bi-shop me-2"></i> TechVerse Store
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="text-white me-3 hover-glow-info">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/productos" className="text-white me-3 hover-glow-info">Productos</Nav.Link>

            {/* Renderizar el carrito solo si el usuario está autenticado */}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/carrito" className="text-white position-relative me-3 hover-glow-info">
                <i className="bi bi-cart4 fs-4"></i>
                {getTotalItems() > 0 && (
                  <Badge pill bg="warning" text="dark" className="position-absolute top-0 start-100 translate-middle">
                    {getTotalItems()}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {/* Lógica condicional para el Admin / Iniciar Sesión */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Nav.Link as={Link} to="/admin" className="text-white me-3 hover-glow-info">
                    <i className="bi bi-gear-fill me-1"></i> Panel Admin
                  </Nav.Link>
                )}
                <Nav.Item className="d-flex align-items-center me-2">
                   <span className="text-white-50 small">Hola, {user?.username}!</span>
                </Nav.Item>
                <Nav.Link onClick={logout} className="text-white">
                  <Button variant="outline-light" size="sm">
                    <i className="bi bi-box-arrow-right me-1"></i> Cerrar Sesión
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-white hover-glow-primary">
                <Button variant="outline-light" size="sm">
                  <i className="bi bi-person-fill me-1"></i> Iniciar Sesión
                </Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;