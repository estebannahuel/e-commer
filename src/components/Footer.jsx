import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-auto">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4 mb-md-0 text-center text-md-start">
            <h5 className="text-warning mb-3"><i className="bi bi-shop me-2"></i> Mi E-Commerce</h5>
            <p className="text-secondary">
              Tu destino confiable para las mejores ofertas en tecnología y más.
              Calidad y servicio garantizados.
            </p>
          </Col>

          <Col md={4} className="mb-4 mb-md-0 text-center">
            <h5 className="text-warning mb-3"><i className="bi bi-link-45deg me-2"></i> Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-white text-decoration-none hover-underline">Inicio</Link></li>
              <li><Link to="/productos" className="text-white text-decoration-none hover-underline">Productos</Link></li>
              <li><Link to="/carrito" className="text-white text-decoration-none hover-underline">Carrito</Link></li>
              <li><Link to="/perfil" className="text-white text-decoration-none hover-underline">Mi Perfil</Link></li>
              <li><Link to="/login" className="text-white text-decoration-none hover-underline">Iniciar Sesión</Link></li>
            </ul>
          </Col>

          <Col md={4} className="text-center text-md-end">
            <h5 className="text-warning mb-3"><i className="bi bi-globe me-2"></i> Síguenos</h5>
            <div className="d-flex justify-content-center justify-content-md-end gap-3 fs-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover-zoom"><i className="bi bi-facebook"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover-zoom"><i className="bi bi-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover-zoom"><i className="bi bi-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover-zoom"><i className="bi bi-linkedin"></i></a>
            </div>
            <div className="mt-3 text-secondary">
              <i className="bi bi-geo-alt-fill me-2"></i>Tristán Suárez, Buenos Aires, Argentina
            </div>
          </Col>
        </Row>

        <hr className="bg-secondary" />

        <Row>
          <Col className="text-center text-secondary">
            <p className="mb-0">&copy; {currentYear} Mi E-Commerce. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>

      {/* Estilos CSS para los efectos de hover */}
      <style jsx>{`
        .hover-underline:hover {
          text-decoration: underline !important;
        }
        .hover-zoom:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;