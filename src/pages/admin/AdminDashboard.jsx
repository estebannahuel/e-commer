// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar'; // Importa la barra lateral

const AdminDashboard = () => {
  return (
    <Container fluid className="p-0 min-vh-100 bg-light">
      <Row className="g-0"> {/* g-0 para eliminar el gutter entre columnas */}
        <Col md={2}>
          <AdminSidebar /> {/* Barra lateral del administrador */}
        </Col>
        <Col md={10} className="p-4">
          <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
            <h1 className="text-center mb-4 text-primary display-4 fw-bold">
              <i className="bi bi-gear-fill me-3"></i> Panel de Administración
            </h1>
            <p className="lead text-secondary text-center mb-5">
              Bienvenido al centro de control de tu e-commerce. Gestiona productos, órdenes, usuarios y más.
            </p>

            <Row className="justify-content-center g-4">
              {/* Gestión de Productos */}
              <Col md={4}>
                <Card className="h-100 text-center shadow-sm border border-info">
                  <Card.Body className="d-flex flex-column justify-content-center">
                    <i className="bi bi-box-seam fs-1 text-info mb-3"></i>
                    <Card.Title className="fs-4 text-info">Gestión de Productos</Card.Title>
                    <Card.Text className="text-secondary mb-3">
                      Añade, edita o elimina productos de tu catálogo. Mantén tu inventario al día.
                    </Card.Text>
                    <Link to="/admin/productos"> {/* Enlace exacto */}
                      <Button variant="info" className="w-100 mt-auto shadow-sm">
                        Ir a Productos
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

              {/* Gestión de Órdenes */}
              <Col md={4}>
                <Card className="h-100 text-center shadow-sm border border-success">
                  <Card.Body className="d-flex flex-column justify-content-center">
                    <i className="bi bi-receipt fs-1 text-success mb-3"></i>
                    <Card.Title className="fs-4 text-success">Gestión de Órdenes</Card.Title>
                    <Card.Text className="text-secondary mb-3">
                      Revisa y actualiza el estado de todos los pedidos de tus clientes.
                    </Card.Text>
                    <Link to="/admin/ordenes"> {/* Enlace exacto */}
                      <Button variant="success" className="w-100 mt-auto shadow-sm">
                        Ir a Órdenes
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

              {/* Gestión de Usuarios */}
              <Col md={4}>
                <Card className="h-100 text-center shadow-sm border border-primary">
                  <Card.Body className="d-flex flex-column justify-content-center">
                    <i className="bi bi-people-fill fs-1 text-primary mb-3"></i>
                    <Card.Title className="fs-4 text-primary">Gestión de Usuarios</Card.Title>
                    <Card.Text className="text-secondary mb-3">
                      Visualiza y administra los usuarios registrados en tu tienda.
                    </Card.Text>
                    <Link to="/admin/usuarios"> {/* Enlace exacto */}
                      <Button variant="primary" className="w-100 mt-auto shadow-sm">
                        Ir a Usuarios
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>

              {/* Reportes y Estadísticas - Siempre abajo */}
              <Col md={12} className="mt-5">
                <Card className="text-center shadow-sm border border-warning">
                  <Card.Body className="py-5">
                    <h2 className="display-5 fw-bold text-warning mb-3">
                      <i className="bi bi-graph-up fs-1 me-3"></i> Reportes y Estadísticas
                    </h2>
                    <p className="lead mb-4">
                      Accede a datos clave sobre tus ventas y el rendimiento de tu tienda.
                    </p>
                    <Button variant="warning" size="lg" disabled>
                      Ver Reportes (Próximamente)
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;