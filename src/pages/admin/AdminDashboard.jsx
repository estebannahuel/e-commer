import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { useOrders } from '../../contexts/OrderContext';

const AdminDashboard = () => {
    // Obtiene el conteo de pedidos con estado "Pendiente" Y no revisados
    const { getPendingOrdersCount } = useOrders();
    const pendingOrdersCount = getPendingOrdersCount();

    return (
        <Container fluid className="p-0 min-vh-100 bg-light">
            <Row className="g-0">
                <Col md={2}>
                    <AdminSidebar />
                </Col>
                <Col md={10} className="p-4">
                    <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                        <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                            <i className="bi bi-gear-fill me-3"></i> Panel de Administración
                        </h1>
                        <p className="lead text-secondary text-center mb-5">
                            Bienvenido al centro de control de tu e-commerce. Gestiona productos, órdenes, usuarios y más.
                        </p>

                        {/* Alerta de Pedidos Nuevos/Pendientes - SOLO si hay pendientes Y no revisados */}
                        {pendingOrdersCount > 0 && (
                            <Alert variant="danger" className="text-center mb-4 border border-danger shadow-sm">
                                <h4 className="alert-heading">¡Atención, {pendingOrdersCount} nuevo(s) pedido(s) por revisar!</h4>
                                <p>Tienes **{pendingOrdersCount}** pedido(s) esperando tu primera revisión.</p>
                                <hr />
                                <div className="d-flex justify-content-center">
                                    <Link to="/admin/ordenes">
                                        <Button variant="outline-danger">
                                            <i className="bi bi-receipt-cutoff me-2"></i> Ir a Gestión de Órdenes
                                        </Button>
                                    </Link>
                                </div>
                            </Alert>
                        )}
                         {/* Mensaje si no hay pedidos pendientes por revisar */}
                         {pendingOrdersCount === 0 && (
                            <Alert variant="success" className="text-center mb-4 border border-success shadow-sm">
                                <h4 className="alert-heading">¡Todo en orden!</h4>
                                <p>No tienes pedidos nuevos pendientes de revisión en este momento.</p>
                                <hr />
                                <div className="d-flex justify-content-center">
                                    <Link to="/admin/ordenes">
                                        <Button variant="outline-success">
                                            <i className="bi bi-receipt-cutoff me-2"></i> Ver todas las Órdenes
                                        </Button>
                                    </Link>
                                </div>
                            </Alert>
                         )}

                        <Row className="justify-content-center g-4">
                            {/* Tarjeta de Resumen de Pedidos Pendientes - SOLO si hay pendientes Y no revisados */}
                            {pendingOrdersCount > 0 && (
                                <Col md={4}>
                                    <Card className="h-100 text-center shadow-sm border border-warning">
                                        <Card.Body className="d-flex flex-column justify-content-center">
                                            <i className="bi bi-bell-fill fs-1 text-warning mb-3"></i>
                                            <Card.Title className="fs-4 text-warning">Pedidos por Revisar</Card.Title>
                                            <Card.Text className="display-4 fw-bold text-warning mb-3">
                                                {pendingOrdersCount}
                                            </Card.Text>
                                            <Card.Text className="text-secondary mb-3">
                                                Nuevas órdenes que necesitan tu atención.
                                            </Card.Text>
                                            <Link to="/admin/ordenes">
                                                <Button variant="warning" className="w-100 mt-auto shadow-sm">
                                                    Ver Pedidos por Revisar
                                                </Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                            {/* Si no hay pedidos pendientes por revisar, esta columna no se muestra */}

                            {/* Gestión de Productos */}
                            <Col md={4}>
                                <Card className="h-100 text-center shadow-sm border border-info">
                                    <Card.Body className="d-flex flex-column justify-content-center">
                                        <i className="bi bi-box-seam fs-1 text-info mb-3"></i>
                                        <Card.Title className="fs-4 text-info">Gestión de Productos</Card.Title>
                                        <Card.Text className="text-secondary mb-3">
                                            Añade, edita o elimina productos de tu catálogo. Mantén tu inventario al día.
                                        </Card.Text>
                                        <Link to="/admin/productos">
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
                                        <Link to="/admin/ordenes">
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
                                        <Link to="/admin/usuarios">
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