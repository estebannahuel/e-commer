import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Badge, NavDropdown, Form, InputGroup, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
// NUEVAS IMPORTACIONES: Para las notificaciones
import UserNotifications from './UserNotifications'; // Asegúrate que la ruta sea correcta
import { useOrders } from '../contexts/OrderContext'; // Para obtener las notificaciones

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItemsInCart } = useCart();
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);
    // NUEVO ESTADO: Para controlar la visibilidad del Offcanvas de notificaciones
    const [showNotifications, setShowNotifications] = useState(false);

    // NUEVO: Obtener funciones y datos de notificaciones del OrderContext
    const { getUserNotifications } = useOrders();
    // Calcular el número de notificaciones no leídas para el usuario actual
    const unreadNotificationsCount = user ? getUserNotifications(user.id).filter(notif => !notif.read).length : 0;

    const handleSearch = (e) => {
        e.preventDefault();
        const searchTerm = e.target.elements.search.value;
        setExpanded(false);
        navigate(`/productos?search=${searchTerm}`);
    };

    const handleNavLinkClick = () => {
        setExpanded(false);
        // También cerramos las notificaciones si están abiertas
        setShowNotifications(false);
    };

    // NUEVAS FUNCIONES: Para abrir y cerrar el Offcanvas de notificaciones
    const handleShowNotifications = () => {
        setShowNotifications(true);
        setExpanded(false); // Cierra el menú de navegación al abrir las notificaciones
    };
    const handleCloseNotifications = () => setShowNotifications(false);

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg py-3" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning" onClick={handleNavLinkClick}>
                        <i className="bi bi-shop me-2"></i> Mi E-Commerce
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="text-white mx-1" onClick={handleNavLinkClick}>Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/productos" className="text-white mx-1" onClick={handleNavLinkClick}>Productos</Nav.Link>

                            {/* Lógica condicional para el carrito: solo visible si NO es administrador */}
                            {user?.role !== 'admin' && (
                                <Nav.Link as={Link} to="/carrito" className="text-white mx-1" onClick={handleNavLinkClick}>
                                    Carrito <Badge bg="danger" className="ms-1">{totalItemsInCart}</Badge>
                                </Nav.Link>
                            )}

                            {isAuthenticated && (
                                <Nav.Link as={Link} to="/mis-ordenes" className="text-white mx-1" onClick={handleNavLinkClick}>Mis Órdenes</Nav.Link>
                            )}
                            {/* Enlace para el dashboard de admin, solo visible si es admin */}
                            {isAuthenticated && user?.role === 'admin' && (
                                <Nav.Link as={Link} to="/admin" className="text-info mx-1 fw-bold" onClick={handleNavLinkClick}>Admin Dashboard</Nav.Link>
                            )}
                        </Nav>

                        {/* Barra de búsqueda */}
                        <Form className="d-flex me-3" onSubmit={handleSearch}>
                            <InputGroup>
                                <FormControl
                                    type="search"
                                    placeholder="Buscar..."
                                    className="me-0"
                                    aria-label="Search"
                                    name="search"
                                />
                                <Button variant="outline-light" type="submit">
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Form>

                        {/* Botones de Notificación, Login/Registro o Perfil/Logout */}
                        <Nav>
                            {/* NUEVO: Botón de Notificaciones, solo visible para usuarios logeados (no admin para simplificar, aunque podría ser para todos) */}
                            {isAuthenticated && user && user.role !== 'admin' && ( // Asumimos notificaciones para usuarios normales
                                <Button
                                    variant="dark"
                                    className="position-relative me-3"
                                    onClick={handleShowNotifications} // Abre el Offcanvas
                                >
                                    <i className="bi bi-bell-fill fs-5"></i>
                                    {unreadNotificationsCount > 0 && (
                                        <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                            {unreadNotificationsCount}
                                            <span className="visually-hidden">notificaciones sin leer</span>
                                        </Badge>
                                    )}
                                </Button>
                            )}


                            {isAuthenticated ? (
                                <NavDropdown
                                    title={
                                        <span className="text-white">
                                            <i className="bi bi-person-circle me-2"></i>
                                            {user?.username} ({user?.role === 'admin' ? 'Admin' : 'Usuario'})
                                        </span>
                                    }
                                    id="basic-nav-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/perfil" onClick={handleNavLinkClick}>
                                        <i className="bi bi-person me-2"></i> Mi Perfil
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => { logout(); handleNavLinkClick(); }} className="text-danger">
                                        <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <Button variant="outline-light" as={Link} to="/login" className="me-2" onClick={handleNavLinkClick}>
                                        <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión
                                    </Button>
                                    <Button variant="warning" as={Link} to="/register" onClick={handleNavLinkClick}>
                                        <i className="bi bi-person-plus-fill me-2"></i> Registrarse
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* NUEVO: Componente UserNotifications - Se renderiza siempre que el Header lo haga */}
            {isAuthenticated && user && ( // Solo renderiza si hay un usuario logeado
                <UserNotifications show={showNotifications} handleClose={handleCloseNotifications} />
            )}
        </>
    );
};

export default Header;