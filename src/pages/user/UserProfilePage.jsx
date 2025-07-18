import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext'; // Para obtener y actualizar el usuario
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const { user, isAuthenticated, updateUserProfile } = useAuth(); // Obtiene el usuario logeado y la función para actualizar
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Cargar los datos del usuario en el formulario cuando el componente se monta o el usuario cambia
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

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

        // Validaciones básicas
        if (!formData.username || !formData.email) {
            setError('El nombre de usuario y el email son campos obligatorios.');
            return;
        }

        try {
            updateUserProfile(user.id, formData); // Llama a la función del contexto para actualizar
            setSuccessMessage('Perfil actualizado exitosamente.');
            setIsEditing(false); // Desactivar modo edición
            // En un caso real, podrías querer recargar los datos del usuario desde el backend
            // o asegurarte de que el contexto los actualice correctamente.
        } catch (err) {
            setError('Error al actualizar el perfil.');
            console.error('Error updating profile:', err);
        }
    };

    if (!user) {
        return (
            <Container className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando perfil...</span>
                </div>
                <p className="mt-2">Cargando perfil de usuario...</p>
            </Container>
        );
    }

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-person-circle me-3"></i> Mi Perfil
                </h1>
                <p className="lead text-secondary text-center mb-5">
                    Gestiona la información de tu cuenta.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-dark text-white fs-5 d-flex justify-content-between align-items-center">
                                <span>Detalles de la Cuenta</span>
                                {!isEditing && (
                                    <Button variant="outline-light" size="sm" onClick={() => setIsEditing(true)}>
                                        <i className="bi bi-pencil-fill me-2"></i> Editar Perfil
                                    </Button>
                                )}
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="username">
                                        <Form.Label>Nombre de Usuario</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="phone">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="address">
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            readOnly={!isEditing}
                                        />
                                    </Form.Group>

                                    {isEditing && (
                                        <div className="d-flex justify-content-end mt-4">
                                            <Button variant="secondary" onClick={() => { setIsEditing(false); setFormData({username: user.username, email: user.email, phone: user.phone, address: user.address}); setError(''); setSuccessMessage(''); }} className="me-2">
                                                Cancelar
                                            </Button>
                                            <Button variant="primary" type="submit">
                                                Guardar Cambios
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="justify-content-center mt-5">
                    <Col lg={8}>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-info text-white fs-5">
                                Acciones Rápidas
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item action as={Button} onClick={() => navigate('/mis-ordenes')} className="d-flex justify-content-between align-items-center">
                                        Ver Mis Órdenes <i className="bi bi-receipt"></i>
                                    </ListGroup.Item>
                                    <ListGroup.Item action as={Button} onClick={() => navigate('/carrito')} className="d-flex justify-content-between align-items-center">
                                        Ir a mi Carrito <i className="bi bi-cart"></i>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default UserProfilePage;