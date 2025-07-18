import React, { useEffect, useMemo } from 'react'; // Agregamos useMemo
import { useNavigate, Link } from 'react-router-dom'; // Para redirección y Link
// IMPORTACIONES DE REACT-BOOTSTRAP
import { Container, Row, Col, Card, Alert, Button, Badge, ListGroup } from 'react-bootstrap';

// IMPORTACIONES DE COMPONENTES Y CONTEXTOS
import AdminSidebar from '../../components/AdminSidebar'; // Asegúrate que esta ruta sea correcta
import { useProducts } from '../../contexts/ProductContext'; // Para obtener datos de productos
import { useOrders } from '../../contexts/OrderContext';     // Para obtener datos de órdenes
import { useAuth } from '../../contexts/AuthContext';         // Para obtener el usuario logueado
import usersData from '../../data/users.json';               // Para obtener la lista COMPLETA de usuarios

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { products, loading: productsLoading, error: productsError } = useProducts();
    const { orders, loading: ordersLoading, error: ordersError } = useOrders();
    const { user, isAuthenticated } = useAuth(); // Obtenemos el usuario logueado para verificar el rol

    const allUsers = usersData; // Usamos la importación directa de users.json para todos los usuarios

    // Redirigir si el usuario no es admin
    useEffect(() => {
        if (!isAuthenticated || (user && user.role !== 'admin')) {
            navigate('/login'); // O a una página de acceso denegado
            alert('Acceso denegado. Debes ser administrador para acceder a esta página.');
        }
    }, [isAuthenticated, user, navigate]);

    // Cálculos de datos para el dashboard, usando useMemo para optimizar
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalUsers = allUsers ? allUsers.length : 0;
    const pendingOrders = orders.filter(order => order.status === 'Pendiente').length;
    const completedOrders = orders.filter(order => order.status === 'Completado').length;
    const lowStockProducts = products.filter(product => product.stock > 0 && product.stock < 5).length;


    // Lógica para determinar los productos más comprados
    const mostPurchasedProducts = useMemo(() => {
        const productSales = {}; // { productId: totalQuantitySold }

        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.productId; // Asegúrate de que OrderContext maneje productId en items
                const quantity = item.quantity;
                productSales[productId] = (productSales[productId] || 0) + quantity;
            });
        });

        // Convertir a un array de { productId, totalQuantitySold } y ordenar
        const sortedSales = Object.entries(productSales)
            .map(([productId, totalQuantitySold]) => ({ productId, totalQuantitySold }))
            .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold);

        // Mapear los IDs de producto a los objetos de producto completos
        const topProducts = sortedSales.map(sale => {
            const product = products.find(p => String(p.id) === String(sale.productId)); // Asegurar comparación de tipo
            return product ? { ...product, totalQuantitySold: sale.totalQuantitySold } : null;
        }).filter(Boolean); // Eliminar productos que no se encontraron (si es que hubo alguno)

        return topProducts.slice(0, 5); // Mostrar los 5 productos más comprados
    }, [orders, products]); // Recalcular solo cuando orders o products cambien


    // Manejo de estados de carga y error
    if (productsLoading || ordersLoading) {
        return (
            <Container className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando datos del panel...</span>
                </div>
                <p className="mt-2">Cargando datos del panel de administración...</p>
            </Container>
        );
    }

    if (productsError || ordersError) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">
                    Error al cargar los datos: {productsError?.message || ordersError?.message}
                </Alert>
            </Container>
        );
    }

    // Si no es admin o no está autenticado, no renderizar el contenido del dashboard aquí
    if (!isAuthenticated || (user && user.role !== 'admin')) {
        return null; // El useEffect ya se encargó de la redirección
    }

    return (
        <Container fluid className="admin-container">
            <Row>
                <Col md={3} className="p-0">
                    <AdminSidebar />
                </Col>
                <Col md={9} className="p-4">
                    <h1 className="mb-4 text-primary display-5 fw-bold">
                        <i className="bi bi-speedometer2 me-3"></i> Dashboard de Administración
                    </h1>
                    <p className="lead text-secondary mb-5">
                        Bienvenido al panel de administración. Aquí puedes gestionar todos los aspectos de tu E-commerce.
                    </p>

                    <Row className="g-4 mb-5">
                        <Col md={4}>
                            <Card className="shadow-sm h-100 border-0 bg-info text-white">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <h3 className="mb-3"><i className="bi bi-box-seam me-2"></i> Productos</h3>
                                    <h1 className="display-4 fw-bold text-center">{totalProducts}</h1>
                                    <p className="text-center mb-0">Productos Disponibles</p>
                                    <Button variant="outline-light" as={Link} to="/admin/productos" className="mt-3">
                                        Gestionar Productos
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="shadow-sm h-100 border-0 bg-success text-white">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <h3 className="mb-3"><i className="bi bi-receipt me-2"></i> Órdenes</h3>
                                    <h1 className="display-4 fw-bold text-center">{totalOrders}</h1>
                                    <p className="text-center mb-0">{pendingOrders} pendientes / {completedOrders} completadas</p>
                                    <Button variant="outline-light" as={Link} to="/admin/ordenes" className="mt-3">
                                        Gestionar Órdenes
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="shadow-sm h-100 border-0 bg-warning text-dark">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <h3 className="mb-3"><i className="bi bi-people me-2"></i> Usuarios</h3>
                                    <h1 className="display-4 fw-bold text-center">{totalUsers}</h1>
                                    <p className="text-center mb-0">Usuarios Registrados</p>
                                    <Button variant="outline-dark" as={Link} to="/admin/usuarios" className="mt-3">
                                        Gestionar Usuarios
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* AÑADIDA: NUEVA TARJETA DE ANÁLISIS DE PRODUCTOS */}
                        <Col md={4}>
                            <Card className="shadow-sm h-100 border-0 bg-primary text-white">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <h3 className="mb-3"><i className="bi bi-bar-chart-fill me-2"></i> Análisis de Productos</h3>
                                    <p className="text-center mb-0">Estadísticas de ventas y valoraciones.</p>
                                    <Button variant="outline-light" as={Link} to="/admin/product-analysis" className="mt-3">
                                        Ver Análisis <i className="bi bi-arrow-right"></i>
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* FIN DE LA NUEVA TARJETA */}
                    </Row>

                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="shadow-sm h-100 border-0">
                                <Card.Header className="bg-danger text-white fs-5">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i> Alertas y Advertencias
                                </Card.Header>
                                <Card.Body>
                                    {lowStockProducts > 0 ? (
                                        <Alert variant="warning" className="d-flex align-items-center">
                                            <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                                            <div>
                                                Hay <span className="fw-bold">{lowStockProducts}</span> productos con poco stock (menos de 5 unidades).
                                                <Link to="/admin/productos" className="alert-link ms-2">Revisar Productos</Link>
                                            </div>
                                        </Alert>
                                    ) : (
                                        <Alert variant="success" className="text-center">
                                            <i className="bi bi-check-circle-fill me-2"></i> No hay alertas de stock bajo.
                                        </Alert>
                                    )}
                                    {pendingOrders > 0 && (
                                        <Alert variant="info" className="d-flex align-items-center mt-3">
                                            <i className="bi bi-bell-fill me-2 fs-4"></i>
                                            <div>
                                                Hay <span className="fw-bold">{pendingOrders}</span> órdenes pendientes de procesamiento.
                                                <Link to="/admin/ordenes" className="alert-link ms-2">Revisar Órdenes</Link>
                                            </div>
                                        </Alert>
                                    )}
                                    {pendingOrders === 0 && lowStockProducts === 0 && (
                                        <p className="text-center text-muted mt-3">Todo en orden por ahora. ¡Buen trabajo!</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm h-100 border-0">
                                <Card.Header className="bg-primary text-white fs-5">
                                    <i className="bi bi-bar-chart-fill me-2"></i> Productos Más Comprados
                                </Card.Header>
                                <Card.Body>
                                    {mostPurchasedProducts.length > 0 ? (
                                        <ListGroup variant="flush">
                                            {mostPurchasedProducts.map((product, index) => (
                                                <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className="fw-bold">{index + 1}. {product.name}</span>
                                                        <Badge bg="secondary" className="ms-2">Vendidos: {product.totalQuantitySold}</Badge>
                                                    </div>
                                                    <Link to={`/producto/${product.id}`} className="btn btn-sm btn-outline-info">
                                                        Ver <i className="bi bi-eye"></i>
                                                    </Link>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <Alert variant="info" className="text-center">
                                            No hay datos de ventas para mostrar.
                                        </Alert>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* Los estilos aquí se asumen que están definidos en un archivo CSS externo o de alguna otra forma */}
            {/* Si usas un archivo CSS, simplemente asegúrate de que estas reglas CSS estén allí */}
            {/* .admin-container, .admin-container > .row, .admin-container > .row > .col-md-3, .admin-container > .row > .col-md-9 */}
        </Container>
    );
};

export default AdminDashboard;