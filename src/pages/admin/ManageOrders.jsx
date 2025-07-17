// src/pages/admin/ManageOrders.jsx (Modificado)
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Dropdown, Alert, ListGroup, Modal } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useOrders } from '../../contexts/OrderContext'; // ¡Importante!

const ManageOrders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useOrders(); // Importa deleteOrder
  const [filterStatus, setFilterStatus] = useState('Todas'); // Filtro por estado
  const [showDetailModal, setShowDetailModal] = useState(false); // Estado para el modal de detalles
  const [selectedOrder, setSelectedOrder] = useState(null); // Orden seleccionada para ver detalles

  // Filtrar órdenes basadas en el estado seleccionado
  const filteredOrders = orders.filter(order =>
    filterStatus === 'Todas' || order.status === filterStatus
  );

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    // Opcional: mostrar un mensaje de éxito
    // alert(`Estado de la orden ${orderId} actualizado a ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la orden ${orderId}? Esta acción no se puede deshacer.`)) {
      deleteOrder(orderId);
      // Opcional: mostrar un mensaje de éxito
      // alert(`Orden ${orderId} eliminada.`);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Pendiente': return 'warning';
      case 'Completado': return 'success'; // Ahora "Completado" es para cuando se recibe el pago
      case 'Enviado': return 'info';
      case 'Entregado': return 'primary'; // Nuevo estado
      case 'Cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  // Funciones para el modal de detalles de la orden
  const handleShowDetailModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedOrder(null);
    setShowDetailModal(false);
  };

  return (
    <Container fluid className="p-0 min-vh-100 bg-light">
      <Row className="g-0">
        <Col md={2}>
          <AdminSidebar />
        </Col>
        <Col md={10} className="p-4">
          <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
            <h1 className="text-center mb-4 text-primary display-4 fw-bold">
              <i className="bi bi-receipt-cutoff me-3"></i> Gestión de Órdenes
            </h1>
            <p className="lead text-secondary text-center mb-5">
              Revisa, actualiza y gestiona el estado de los pedidos de tus clientes.
            </p>

            <Row className="mb-4 align-items-center">
              <Col xs={6}>
                <h4 className="mb-0 text-primary">Total Órdenes: {filteredOrders.length}</h4>
              </Col>
              <Col xs={6} className="text-end">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                    Filtrar por Estado: **{filterStatus}**
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setFilterStatus('Todas')}>Todas</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterStatus('Pendiente')}>Pendiente</Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterStatus('Completado')}>Completado (Pago Recibido)</Dropdown.Item> {/* Texto actualizado */}
                    <Dropdown.Item onClick={() => setFilterStatus('Enviado')}>Enviado (Paquete Preparado)</Dropdown.Item> {/* Texto actualizado */}
                    <Dropdown.Item onClick={() => setFilterStatus('Entregado')}>Entregado</Dropdown.Item> {/* Nuevo filtro */}
                    <Dropdown.Item onClick={() => setFilterStatus('Cancelado')}>Cancelado</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            {filteredOrders.length === 0 ? (
              <Alert variant="info" className="text-center">No hay órdenes para mostrar con este filtro.</Alert>
            ) : (
              <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>ID Orden</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th> {/* Columna de acciones */}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.userName}</td>
                      <td>{order.date}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <Button variant={getStatusVariant(order.status)} size="sm" disabled>
                          {order.status}
                        </Button>
                      </td>
                      <td>
                        <Dropdown className="me-2 d-inline-block"> {/* Dropdown para cambiar estado */}
                          <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-status-${order.id}`}>
                            Cambiar Estado
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {/* Orden de los estados según el flujo */}
                            <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Pendiente')}>Pendiente</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Completado')}>Completado (Pago Recibido)</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Enviado')}>Enviado (Paquete Preparado)</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Entregado')}>Entregado</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(order.id, 'Cancelado')}>Cancelado</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Button variant="info" size="sm" className="me-2" onClick={() => handleShowDetailModal(order)}>
                          <i className="bi bi-eye-fill"></i> {/* Icono para ver detalles */}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order.id)}>
                          <i className="bi bi-trash-fill"></i> {/* Icono para eliminar */}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Container>
        </Col>
      </Row>

      {/* Modal de Detalles de la Orden */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Orden {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p><strong>Usuario:</strong> {selectedOrder.userName}</p>
              <p><strong>Fecha:</strong> {selectedOrder.date}</p>
              <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
              <p><strong>Estado:</strong> <Button variant={getStatusVariant(selectedOrder.status)} size="sm" disabled>{selectedOrder.status}</Button></p>
              <h5>Artículos:</h5>
              <ListGroup variant="flush">
                {selectedOrder.items.map((item, index) => (
                  <ListGroup.Item key={index}>
                    {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default ManageOrders;