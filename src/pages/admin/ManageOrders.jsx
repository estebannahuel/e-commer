import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, NavDropdown, Alert, ListGroup } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext'; // <--- ¡NUEVA IMPORTACIÓN! Para obtener la lista de usuarios

const ManageOrders = () => {
    const { orders, getAllOrders, updateOrderStatus } = useOrders();
    const { allUsers } = useAuth(); // <--- ¡NUEVO: Obtener allUsers del AuthContext!

    const [filterStatus, setFilterStatus] = useState('Todas');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // No necesitas este useEffect si getAllOrders no tiene dependencias externas
    // useEffect(() => {
    //     if (typeof getAllOrders === 'function') {
    //         getAllOrders();
    //     }
    // }, [getAllOrders]);

    // Obtener el nombre de usuario para mostrarlo en la tabla de órdenes
    const getUserName = (userId) => {
        // MODIFICADO: Ahora busca en la lista de usuarios obtenida del AuthContext
        const user = allUsers.find(u => u.id === userId);
        return user ? user.username : 'Usuario Desconocido';
    };

    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Pendiente': return 'warning';
            case 'En Proceso': return 'info';
            case 'Completado': return 'success';
            case 'Cancelado': return 'danger';
            default: return 'secondary';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'Todas') {
            return true;
        }
        return order.status === filterStatus;
    });

    const handleShowOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        if (window.confirm(`¿Estás seguro de cambiar el estado de la orden ${orderId} a "${newStatus}"?`)) {
            updateOrderStatus(orderId, newStatus);
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
            }
        }
    };

    return (
        <Container fluid className="admin-container">
            <Row>
                <Col md={3} className="p-0">
                    <AdminSidebar />
                </Col>
                <Col md={9} className="p-4">
                    <h1 className="mb-4 text-primary display-5 fw-bold">
                        <i className="bi bi-receipt me-3"></i> Gestión de Órdenes
                    </h1>
                    <p className="lead text-secondary mb-4">
                        Revisa y gestiona todas las órdenes realizadas por los usuarios.
                    </p>

                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Header className="bg-dark text-white fs-5">Filtro de Órdenes</Card.Header>
                        <Card.Body>
                            <Form.Group controlId="filterStatus">
                                <Form.Label>Filtrar por Estado:</Form.Label>
                                <Form.Control as="select" onChange={handleStatusChange} value={filterStatus}>
                                    <option value="Todas">Todas</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Proceso">En Proceso</option>
                                    <option value="Completado">Completado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </Form.Control>
                            </Form.Group>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-dark text-white fs-5">Lista de Órdenes</Card.Header>
                        <Card.Body>
                            {filteredOrders.length === 0 ? (
                                <Alert variant="info" className="text-center">
                                    No se encontraron órdenes con el estado seleccionado.
                                </Alert>
                            ) : (
                                <Table striped bordered hover responsive className="text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID Orden</th>
                                            <th>Usuario</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                {/* Aseguramos que allUsers no sea null o undefined antes de llamar a getUserName */}
                                                <td>{allUsers && getUserName(order.userId)}</td>
                                                <td>{order.date}</td>
                                                <td>${order.total.toFixed(2)}</td>
                                                <td>
                                                    <Badge bg={getStatusVariant(order.status)} className="p-2">
                                                        {order.status}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="info"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleShowOrderDetails(order)}
                                                    >
                                                        <i className="bi bi-eye-fill"></i> Ver
                                                    </Button>
                                                    <NavDropdown
                                                        title="Cambiar Estado"
                                                        id={`dropdown-status-${order.id}`}
                                                        variant="secondary"
                                                        size="sm"
                                                        align="end"
                                                    >
                                                        <NavDropdown.Item onClick={() => handleUpdateStatus(order.id, 'Pendiente')}>Pendiente</NavDropdown.Item>
                                                        <NavDropdown.Item onClick={() => handleUpdateStatus(order.id, 'En Proceso')}>En Proceso</NavDropdown.Item>
                                                        <NavDropdown.Item onClick={() => handleUpdateStatus(order.id, 'Completado')}>Completado</NavDropdown.Item>
                                                        <NavDropdown.Item onClick={() => handleUpdateStatus(order.id, 'Cancelado')}>Cancelado</NavDropdown.Item>
                                                    </NavDropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Modal de Detalles de la Orden */}
                    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                        <Modal.Header closeButton className="bg-primary text-white">
                            <Modal.Title>Detalles de la Orden: {selectedOrder?.id}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedOrder && (
                                <div>
                                    <h5>Información General</h5>
                                    <p><strong>Usuario:</strong> {allUsers && getUserName(selectedOrder.userId)}</p>
                                    <p><strong>Fecha:</strong> {selectedOrder.date}</p>
                                    <p><strong>Estado:</strong> <Badge bg={getStatusVariant(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                                    <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>

                                    <h5 className="mt-4">Productos Incluidos</h5>
                                    <ListGroup className="mb-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <ListGroup.Item key={index} className="d-flex justify-content-between">
                                                <span>{item.name} (x{item.quantity})</span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>

                                    <h5 className="mt-4">Información de Envío</h5>
                                    <p><strong>Dirección:</strong> {selectedOrder.shippingInfo?.shippingAddress}</p>
                                    <p><strong>Ciudad:</strong> {selectedOrder.shippingInfo?.city}</p>
                                    <p><strong>Código Postal:</strong> {selectedOrder.shippingInfo?.postalCode}</p>
                                    <p><strong>País:</strong> {selectedOrder.shippingInfo?.country}</p>

                                    <h5 className="mt-4">Método de Pago</h5>
                                    <p>{selectedOrder.paymentMethod || 'No especificado'}</p>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default ManageOrders;