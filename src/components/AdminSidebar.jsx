import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation(); // Hook para obtener la ruta actual

    return (
        <div className="d-flex flex-column p-3 text-white bg-dark sidebar-admin" style={{ minHeight: '100%' }}>
            <Link to="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <i className="bi bi-gear-fill me-2 fs-4 text-warning"></i>
                <span className="fs-5 fw-bold">Panel Admin</span>
            </Link>
            <hr className="border-secondary" />
            <Nav className="flex-column mb-auto">
                <Nav.Item className="mb-2">
                    <Nav.Link
                        as={Link}
                        to="/admin"
                        className={`text-white py-2 px-3 rounded ${location.pathname === '/admin' ? 'active-admin-link' : ''}`}
                    >
                        <i className="bi bi-speedometer2 me-3"></i> Dashboard
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                    <Nav.Link
                        as={Link}
                        to="/admin/productos"
                        className={`text-white py-2 px-3 rounded ${location.pathname.startsWith('/admin/productos') ? 'active-admin-link' : ''}`}
                    >
                        <i className="bi bi-box-seam me-3"></i> Gestionar Productos
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                    <Nav.Link
                        as={Link}
                        to="/admin/ordenes"
                        className={`text-white py-2 px-3 rounded ${location.pathname.startsWith('/admin/ordenes') ? 'active-admin-link' : ''}`}
                    >
                        <i className="bi bi-receipt me-3"></i> Gestionar Órdenes
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-2">
                    <Nav.Link
                        as={Link}
                        to="/admin/usuarios"
                        className={`text-white py-2 px-3 rounded ${location.pathname.startsWith('/admin/usuarios') ? 'active-admin-link' : ''}`}
                    >
                        <i className="bi bi-people me-3"></i> Gestionar Usuarios
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <hr className="border-secondary" />
            <div className="dropdown">
                <Link to="/" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="/images/user-placeholder.png" alt="mdo" width="32" height="32" className="rounded-circle me-2" />
                    <strong>Volver al sitio</strong>
                </Link>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><Link className="dropdown-item" to="/perfil">Perfil de Usuario</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/">Ir a Inicio</Link></li>
                </ul>
            </div>

            {/* Estilos CSS específicos para el sidebar */}
            <style jsx>{`
                .sidebar-admin {
                    position: sticky;
                    top: 0; /* Asegura que se pegue arriba */
                    height: 100vh; /* Ocupa el 100% de la altura de la ventana */
                    overflow-y: auto; /* Permite scroll si el contenido es largo */
                }
                .active-admin-link {
                    background-color: var(--bs-primary) !important; /* Color de Bootstrap Primary */
                    font-weight: bold;
                }
                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default AdminSidebar;