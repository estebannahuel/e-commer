import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Alert,
  Spinner,
  Button, // <-- Importa Button
  Modal // <-- Importa Modal
} from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useProducts } from '../../contexts/ProductContext';
import { useOrders } from '../../contexts/OrderContext';
import { useReviews } from '../../contexts/ReviewContext'; // <-- Importa useReviews
import { useAuth } from '../../contexts/AuthContext'; // <-- Importa useAuth para obtener info de usuarios
import RatingStars from '../../components/RatingStars';

const ProductAnalysisPage = () => {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { getAllOrders } = useOrders();
  const { getAllReviews } = useReviews(); // <-- Obtener la función para todas las reviews
  const { allUsers } = useAuth(); // <-- Obtener todos los usuarios

  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState(null);

  // Estados para el modal de detalles
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailType, setDetailType] = useState(''); // 'reviews' o 'orders'

  // Funciones para abrir el modal
  const handleShowReviews = (product) => {
    setSelectedProduct(product);
    setDetailType('reviews');
    setShowDetailsModal(true);
  };

  const handleShowPurchases = (product) => {
    setSelectedProduct(product);
    setDetailType('orders');
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProduct(null);
    setDetailType('');
  };

  useEffect(() => {
    const performAnalysis = () => {
      setAnalysisLoading(true);
      setAnalysisError(null);
      try {
        if (!products || products.length === 0) {
          throw new Error("No hay productos cargados para el análisis.");
        }

        const allOrders = getAllOrders();
        const salesMap = new Map();

        if (allOrders && allOrders.length > 0) {
          allOrders.forEach(order => {
            order.items.forEach(item => {
              const currentSales = salesMap.get(item.productId) || 0;
              salesMap.set(item.productId, currentSales + item.quantity);
            });
          });
        }

        const sortedSelling = Array.from(salesMap.entries())
          .map(([productId, totalSold]) => {
            const product = products.find(p => String(p.id) === String(productId));
            return product ? { ...product, totalSold } : null;
          })
          .filter(Boolean)
          .sort((a, b) => b.totalSold - a.totalSold)
          .slice(0, 5);
        setTopSellingProducts(sortedSelling);

        const sortedRated = [...products]
          .filter(p => p.averageRating && p.ratingCount > 0)
          .sort((a, b) => {
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }
            return b.ratingCount - a.ratingCount;
          })
          .slice(0, 5);
        setTopRatedProducts(sortedRated);

      } catch (err) {
        console.error("Error durante el análisis de productos:", err);
        setAnalysisError(err);
      } finally {
        setAnalysisLoading(false);
      }
    };

    if (!productsLoading && !productsError) {
      performAnalysis();
    }

  }, [products, getAllOrders, productsLoading, productsError]); // <-- No incluyas 'orders' directamente si no es una dependencia real que cambie. 'getAllOrders' es suficiente.

  // Componentes auxiliares para el modal (pueden ir aquí o en archivos separados)
  const ReviewsList = ({ productId }) => {
    const reviews = getAllReviews().filter(review => String(review.productId) === String(productId));

    if (reviews.length === 0) {
      return <Alert variant="info">No hay valoraciones para este producto aún.</Alert>;
    }

    return (
      <div>
        <ul className="list-group">
          {reviews.map(review => {
            const user = allUsers.find(u => String(u.id) === String(review.userId));
            return (
              <li key={review.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user ? user.username : 'Usuario Desconocido'}</strong>
                  <br />
                  <small className="text-muted">{user ? user.email : 'N/A'}</small>
                  <br />
                  <span>Valoración: <RatingStars rating={review.rating} size="1em" /> ({review.rating} estrellas)</span>
                  {review.comment && (
                    <p className="mb-0 text-italic">"<em>{review.comment}</em>"</p>
                  )}
                  <small className="text-secondary">{new Date(review.timestamp).toLocaleDateString()}</small>
                </div>
                {user && user.email && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href={`mailto:${user.email}?subject=Feedback%20sobre%20su%20valoración%20de%20${selectedProduct?.name || 'producto'}`}
                  >
                    Enviar Correo
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const OrdersList = ({ productId }) => {
    const allOrders = getAllOrders();
    // Filtramos las órdenes que contienen el productId en sus ítems
    const productOrders = allOrders.filter(order =>
      order.items.some(item => String(item.productId) === String(productId))
    );

    if (productOrders.length === 0) {
      return <Alert variant="info">Este producto no ha sido comprado aún.</Alert>;
    }

    return (
      <div>
        <ul className="list-group">
          {productOrders.map(order => {
            const user = allUsers.find(u => String(u.id) === String(order.userId));
            const purchasedItem = order.items.find(item => String(item.productId) === String(productId));
            return (
              <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user ? user.username : 'Usuario Desconocido'}</strong>
                  <br />
                  <small className="text-muted">{user ? user.email : 'N/A'}</small>
                  <br />
                  <span>Cantidad comprada: {purchasedItem?.quantity}</span>
                  <br />
                  <small className="text-secondary">Orden ID: {order.id} - Fecha: {new Date(order.date).toLocaleDateString()}</small>
                </div>
                {user && user.email && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href={`mailto:${user.email}?subject=Sobre%20su%20compra%20de%20${selectedProduct?.name || 'producto'}%20(Orden%20${order.id})`}
                  >
                    Enviar Correo
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  // Fin de componentes auxiliares

  const isLoading = productsLoading || analysisLoading;
  const hasError = productsError || analysisError;

  if (isLoading) {
    return (
      <Container fluid className="admin-container">
        <Row>
          <Col md={3} className="p-0">
            <AdminSidebar />
          </Col>
          <Col md={9} className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Spinner animation="border" role="status" className="text-primary me-2">
              <span className="visually-hidden">Cargando análisis...</span>
            </Spinner>
            <p className="mt-2 text-muted">Cargando datos para el análisis...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  if (hasError) {
    return (
      <Container fluid className="admin-container">
        <Row>
          <Col md={3} className="p-0">
            <AdminSidebar />
          </Col>
          <Col md={9} className="p-4">
            <Alert variant="danger" className="mt-4">
              Error al cargar datos para el análisis: {hasError.message}
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="admin-container">
      <Row>
        <Col md={3} className="p-0">
          <AdminSidebar />
        </Col>
        <Col md={9} className="p-4">
          <h1 className="mb-4 text-primary display-5 fw-bold">
            <i className="bi bi-bar-chart-fill me-3"></i> Análisis de Productos
          </h1>
          <p className="lead text-secondary mb-4">
            Visualiza los productos más populares por ventas y valoraciones.
          </p>

          {/* Sección de Productos Más Vendidos */}
          <Card className="shadow-sm border-0 mb-5">
            <Card.Header className="bg-success text-white fs-5">
              <i className="bi bi-graph-up me-2"></i> Productos Más Vendidos (Top 5)
            </Card.Header>
            <Card.Body>
              {topSellingProducts.length === 0 ? (
                <Alert variant="info" className="text-center">No hay suficientes datos de ventas para mostrar.</Alert>
              ) : (
                <Table striped bordered hover responsive className="text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Pos.</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Unidades Vendidas</th>
                      <th>Acciones</th> {/* <-- Nueva columna */}
                    </tr>
                  </thead>
                  <tbody>
                    {topSellingProducts.map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td className="text-start d-flex align-items-center">
                          <img
                            src={product.image || '/images/placeholder.jpg'}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                          />
                          {product.name}
                        </td>
                        <td>{product.category}</td>
                        <td>{product.totalSold}</td>
                        <td>
                          {/* Botón para ver detalles de compras */}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleShowPurchases(product)}
                            disabled={product.totalSold === 0}
                          >
                            <i className="bi bi-cart me-1"></i> Ver Compras
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {/* Sección de Productos Mejor Valorados */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-info text-white fs-5">
              <i className="bi bi-star-fill me-2"></i> Productos Mejor Valorados (Top 5)
            </Card.Header>
            <Card.Body>
              {topRatedProducts.length === 0 ? (
                <Alert variant="info" className="text-center">No hay productos con valoraciones para mostrar.</Alert>
              ) : (
                <Table striped bordered hover responsive className="text-center">
                  <thead className="table-light">
                    <tr>
                      <th>Pos.</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Valoración Promedio</th>
                      <th>N° Valoraciones</th>
                      <th>Acciones</th> {/* <-- Nueva columna */}
                    </tr>
                  </thead>
                  <tbody>
                    {topRatedProducts.map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td className="text-start d-flex align-items-center">
                          <img
                            src={product.image || '/images/placeholder.jpg'}
                            alt={product.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                          />
                          {product.name}
                        </td>
                        <td>{product.category}</td>
                        <td>
                          <RatingStars rating={product.averageRating} size="1.2em" />
                          <span className="ms-2">({product.averageRating.toFixed(1)})</span>
                        </td>
                        <td>{product.ratingCount}</td>
                        <td>
                          {/* Botón para ver detalles de valoraciones */}
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleShowReviews(product)}
                            disabled={product.ratingCount === 0}
                          >
                            <i className="bi bi-star me-1"></i> Ver Valoraciones
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {/* Modal de Detalles */}
          <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg" centered>
            <Modal.Header closeButton className="bg-light text-dark">
              <Modal.Title className="fw-bold">
                {selectedProduct && detailType === 'reviews' && `Valoraciones de ${selectedProduct.name}`}
                {selectedProduct && detailType === 'orders' && `Compras de ${selectedProduct.name}`}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-white text-dark">
              {selectedProduct && detailType === 'reviews' && (
                <ReviewsList productId={selectedProduct.id} />
              )}
              {selectedProduct && detailType === 'orders' && (
                <OrdersList productId={selectedProduct.id} />
              )}
            </Modal.Body>
            <Modal.Footer className="bg-light border-top">
              <Button variant="secondary" onClick={handleCloseDetailsModal}>Cerrar</Button>
            </Modal.Footer>
          </Modal>

        </Col>
      </Row>
    </Container>
  );
};

export default ProductAnalysisPage;