// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // [cite: 2025-06-11]

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row className="text-center">
          <Col md={6} className="mb-3 mb-md-0">
            <p className="mb-0">&copy; {currentYear} TechVerse Store. Todos los derechos reservados.</p>
          </Col>
          <Col md={6}>
            <p className="mb-0">Desarrollado con <i className="bi bi-heart-fill text-danger me-1"></i> por [Tu Nombre/Empresa]</p>
            <div className="mt-2">
              <a href="#" className="text-white me-3"><i className="bi bi-facebook fs-5"></i></a>
              <a href="#" className="text-white me-3"><i className="bi bi-twitter fs-5"></i></a>
              <a href="#" className="text-white"><i className="bi bi-instagram fs-5"></i></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;