// src/pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../contexts/AuthContext'; // Importa useAuth para obtener y gestionar usuarios

const ManageUsers = () => {
  const { getAllUsers, updateUser, deleteUser, user: currentUser } = useAuth(); // Obtén funciones y el usuario actual
  const [users, setUsers] = useState([]); // Estado local para mostrar los usuarios
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Usuario que se está editando
  const [formUser, setFormUser] = useState({ id: '', username: '', role: '', phone: '', password: '' }); // Agregado password para editar (opcional)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setUsers(getAllUsers()); // Carga los usuarios al montar el componente
  }, [getAllUsers]); // Se actualiza si getAllUsers cambia (aunque no debería)

  const handleShowModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormUser({
        id: user.id,
        username: user.username,
        role: user.role,
        phone: user.phone || '',
        password: '' // No mostrar la contraseña real, dejar vacío para no cambiar si no se edita
      });
    } else {
      setFormUser({ id: '', username: '', role: 'user', phone: '', password: '' });
    }
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUsers(getAllUsers()); // Recarga la lista después de cerrar el modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formUser.username || !formUser.role) {
      setError('Nombre de usuario y rol son obligatorios.');
      return;
    }

    // Lógica para añadir (si fuera el caso, aunque solo editamos/eliminamos aquí)
    // Para añadir un usuario, se usaría la función register del AuthContext, no aquí.
    // Este formulario es principalmente para editar roles y otros datos.

    const userToSave = { ...formUser };
    if (!userToSave.password) {
      // Si la contraseña está vacía al editar, mantener la anterior
      const originalUser = users.find(u => u.id === userToSave.id);
      userToSave.password = originalUser ? originalUser.password : '';
    }

    updateUser(userToSave);
    setSuccess('Usuario actualizado con éxito.');
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (currentUser && currentUser.id === id) {
      alert("No puedes eliminar tu propia cuenta mientras estás logueado.");
      return;
    }
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser(id);
      setSuccess('Usuario eliminado con éxito.');
      setUsers(getAllUsers()); // Recarga la lista después de eliminar
    }
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
              <i className="bi bi-person-fill-gear me-3"></i> Gestión de Usuarios
            </h1>
            <p className="lead text-secondary text-center mb-5">
              Administra los usuarios registrados en tu plataforma.
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {users.length === 0 ? (
              <Alert variant="info" className="text-center">No hay usuarios registrados.</Alert>
            ) : (
              <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Rol</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(user)}>
                          <i className="bi bi-pencil-fill"></i>
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)} disabled={currentUser && currentUser.id === user.id}>
                          <i className="bi bi-trash-fill"></i>
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

      {/* Modal para Editar Usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formUser.username} onChange={handleChange} required disabled={true} /> {/* Username no editable */}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="role" value={formUser.role} onChange={handleChange} required>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" name="phone" value={formUser.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña (dejar vacío para no cambiar)</Form.Label>
              <Form.Control type="password" name="password" value={formUser.password} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageUsers;