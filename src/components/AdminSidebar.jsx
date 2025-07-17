// src/components/AdminSidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <Nav className="flex-column bg-dark text-white p-3 min-vh-100">
      <h5 className="text-light mb-4">Menú Admin</h5>
      <Nav.Item className="mb-2">
        <Nav.Link as={Link} to="/admin" className="text-white d-flex align-items-center hover-glow-info">
          <i className="bi bi-speedometer2 me-2 fs-5"></i> Dashboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-2">
        <Nav.Link as={Link} to="/admin/productos" className="text-white d-flex align-items-center hover-glow-info">
          <i className="bi bi-box-seam me-2 fs-5"></i> Gestión Productos
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-2">
        <Nav.Link as={Link} to="/admin/ordenes" className="text-white d-flex align-items-center hover-glow-info">
          <i className="bi bi-receipt me-2 fs-5"></i> Gestión Órdenes
        </Nav.Link>
      </Nav.Item>
      <Nav.Item className="mb-2">
        <Nav.Link as={Link} to="/admin/usuarios" className="text-white d-flex align-items-center hover-glow-info">
          <i className="bi bi-people-fill me-2 fs-5"></i> Gestión Usuarios
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default AdminSidebar;