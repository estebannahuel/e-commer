import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Alert, ListGroup } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrderContext';

const ManageUsers = () => {
    const { user: loggedInUser, allUsers, updateAllUsers } = useAuth(); 
    const [users, setUsers] = useState(allUsers);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        address: '',
        role: 'user'
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
    const [offerMessage, setOfferMessage] = useState('');
    const [offerSentMessage, setOfferSentMessage] = useState('');

    const { orders } = useOrders();

    useEffect(() => {
        setUsers(allUsers);
    }, [allUsers]);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                id: currentUser.id,
                username: currentUser.username,
                password: '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                role: currentUser.role
            });
        } else {
            setFormData({
                id: '',
                username: '',
                password: '',
                email: '',
                phone: '',
                address: '',
                role: 'user'
            });
        }
    }, [currentUser]);

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentUser(null);
        setError('');
        setSuccessMessage('');
    };

    const handleShowAddModal = () => {
        setIsEditing(false);
        setCurrentUser(null);
        setShowModal(true);
    };

    const handleShowEditModal = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.username || !formData.email || (!isEditing && !formData.password)) {
            setError('Por favor, completa los campos obligatorios: Nombre de Usuario, Email, y Contraseña (para nuevos usuarios).');
            return;
        }

        if (!isEditing && formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        let updatedUsersList;

        if (isEditing) {
            const userIndex = allUsers.findIndex(u => u.id === formData.id);
            if (userIndex > -1) {
                const updatedUser = {
                    ...allUsers[userIndex],
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    role: formData.role
                };
                if (formData.password) {
                    updatedUser.password = formData.password;
                }
                updatedUsersList = [...allUsers];
                updatedUsersList[userIndex] = updatedUser;
                setSuccessMessage('Usuario actualizado exitosamente.');
            } else {
                setError('Error: Usuario no encontrado para actualizar.');
                return;
            }
        } else {
            const newId = `user${Date.now()}`;
            const newUser = {
                id: newId,
                username: formData.username,
                password: formData.password,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                role: formData.role || 'user'
            };
            if (allUsers.some(u => u.username === newUser.username)) {
                setError('El nombre de usuario ya existe.');
                return;
            }
            if (allUsers.some(u => u.email === newUser.email)) {
                setError('El email ya está registrado.');
                return;
            }
            updatedUsersList = [...allUsers, newUser];
            setSuccessMessage('Usuario añadido exitosamente.');
        }

        updateAllUsers(updatedUsersList); 

        setTimeout(() => {
            handleCloseModal();
        }, 1500);
    };

    const handleDeleteUser = (userId) => {
        if (loggedInUser && loggedInUser.id === userId) {
            alert('No puedes eliminar tu propia cuenta mientras estás logeado.');
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            const updatedUsers = allUsers.filter(u => u.id !== userId);
            updateAllUsers(updatedUsers); 
            alert('Usuario eliminado (simulado).');
        }
    };

    const filteredUsers = allUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleShowHistoryModal = (user) => {
        setSelectedUserForHistory(user);
        setShowHistoryModal(true);
        setOfferSentMessage('');
    };

    const handleCloseHistoryModal = () => {
        setShowHistoryModal(false);
        setSelectedUserForHistory(null);
        setOfferMessage('');
        setOfferSentMessage('');
    };

    const handleOfferMessageChange = (e) => {
        setOfferMessage(e.target.value);
    };

    const handleSendOffer = () => {
        if (!selectedUserForHistory) return;
        if (!offerMessage.trim()) {
            alert('Por favor, escribe un mensaje para la oferta.');
            return;
        }

        console.log(`Simulando envío de oferta a: ${selectedUserForHistory.email}`);
        console.log(`Mensaje de la oferta: ${offerMessage}`);
        
        setOfferSentMessage(`Oferta simulada enviada a ${selectedUserForHistory.username} (${selectedUserForHistory.email}).`);
        setOfferMessage('');
        
        setTimeout(() => {
            setOfferSentMessage('');
        }, 5000);
    };

    const userOrders = selectedUserForHistory
        ? orders.filter(order => String(order.userId) === String(selectedUserForHistory.id))
        : [];

    return (
        <Container fluid className="admin-container">
            <Row>
                <Col md={3} className="p-0">
                    <AdminSidebar />
                </Col>
                <Col md={9} className="p-4">
                    <h1 className="mb-4 text-primary display-5 fw-bold">
                        <i className="bi bi-people me-3"></i> Gestión de Usuarios
                    </h1>
                    <p className="lead text-secondary mb-4">
                        Revisa y gestiona las cuentas de los usuarios registrados, su historial de compras y envía ofertas.
                    </p>

                    <Row className="mb-4 justify-content-between align-items-center">
                        <Col md={6}>
                            <Form.Group controlId="searchUsers">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por nombre de usuario o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="text-end">
                            <Button variant="success" onClick={handleShowAddModal}>
                                <i className="bi bi-person-plus-fill me-2"></i> Añadir Nuevo Usuario
                            </Button>
                        </Col>
                    </Row>

                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-dark text-white fs-5">Lista de Usuarios</Card.Header>
                        <Card.Body>
                            {filteredUsers.length === 0 ? (
                                <Alert variant="info" className="text-center">
                                    No se encontraron usuarios que coincidan con la búsqueda.
                                </Alert>
                            ) : (
                                <Table striped bordered hover responsive className="text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre de Usuario</th>
                                            <th>Email</th>
                                            <th>Teléfono</th>
                                            <th>Rol</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td className="text-start">{user.username}</td>
                                                <td className="text-start">{user.email}</td>
                                                <td>{user.phone || 'N/A'}</td>
                                                <td>
                                                    <Badge bg={user.role === 'admin' ? 'info' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="info"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleShowHistoryModal(user)}
                                                    >
                                                        <i className="bi bi-clock-history me-1"></i> Historial
                                                    </Button>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleShowEditModal(user)}
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={loggedInUser && loggedInUser.id === user.id}
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>

                    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                        <Modal.Header closeButton className="bg-primary text-white">
                            <Modal.Title>{isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="username">
                                            <Form.Label>Nombre de Usuario <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="password">
                                            <Form.Label>Contraseña {isEditing ? '(dejar vacío para no cambiar)' : <span className="text-danger">*</span>}</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required={!isEditing}
                                                placeholder={isEditing ? '••••••••' : 'Ingresar contraseña'}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="role">
                                            <Form.Label>Rol</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="user">Usuario</option>
                                                <option value="admin">Administrador</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="address">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Usuario'}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Modal para Historial de Compras y Envío de Ofertas */}
                    <Modal show={showHistoryModal} onHide={handleCloseHistoryModal} centered size="lg">
                        <Modal.Header closeButton className="bg-info text-white">
                            <Modal.Title>Historial y Ofertas para {selectedUserForHistory?.username}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* Envuelve el contenido condicional en un fragmento para que Modal.Body tenga un solo hijo directo */}
                            <> 
                                {selectedUserForHistory ? (
                                    <Row>
                                        <Col md={12} className="mb-4">
                                            <h4 className="mb-3">Historial de Compras ({selectedUserForHistory.username})</h4>
                                            {userOrders.length > 0 ? (
                                                <ListGroup>
                                                    {userOrders.map(order => (
                                                        <ListGroup.Item key={order.id} className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>Orden #{order.id}</strong> - Fecha: {order.date}
                                                                <br />
                                                                Total: ${order.total.toFixed(2)} - Estado: <Badge bg={order.status === 'Completado' ? 'success' : 'warning'}>{order.status}</Badge>
                                                                <div className="mt-2">
                                                                    <h6>Productos:</h6>
                                                                    <ListGroup variant="flush">
                                                                        {order.items.map(item => (
                                                                            <ListGroup.Item key={item.productId} className="py-1 px-0 border-0">
                                                                                {item.name} (x{item.quantity}) - ${item.price.toFixed(2)} c/u
                                                                            </ListGroup.Item>
                                                                        ))}
                                                                    </ListGroup>
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            ) : (
                                                <Alert variant="info" className="text-center">
                                                    Este usuario no tiene compras registradas.
                                                </Alert>
                                            )}
                                        </Col>
                                        <Col md={12}>
                                            <Card>
                                                <Card.Header className="bg-success text-white">
                                                    Enviar Oferta Personalizada
                                                </Card.Header>
                                                <Card.Body>
                                                    {offerSentMessage && <Alert variant="success">{offerSentMessage}</Alert>}
                                                    <Form.Group className="mb-3" controlId="offerMessage">
                                                        <Form.Label>Mensaje de la Oferta</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={4}
                                                            value={offerMessage}
                                                            onChange={handleOfferMessageChange}
                                                            placeholder={`Escribe aquí la oferta para ${selectedUserForHistory.username}...`}
                                                        />
                                                    </Form.Group>
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleSendOffer}
                                                        disabled={!offerMessage.trim()}
                                                    >
                                                        <i className="bi bi-envelope-fill me-2"></i> Simular Envío de Oferta
                                                    </Button>
                                                    <p className="mt-2 text-muted fst-italic">
                                                        {'(Esto simula el envío del correo; en una aplicación real, se integraría con un servicio de email.)'}
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Alert variant="warning">No se ha seleccionado ningún usuario.</Alert>
                                )}
                            </> {/* Cierre del fragmento */}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseHistoryModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </Col>
            </Row>
        </Container>
    );
};

export default ManageUsers;