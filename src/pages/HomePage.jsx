import React from 'react';
import { Container, Row, Col, Carousel, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext'; // Para obtener los productos
import ProductCard from '../components/ProductCard'; // Para mostrar productos

const HomePage = () => {
    const { products, loading, error } = useProducts();

    // Filtra y ordena productos para el carrusel (ej: los 3 más vendidos)
    const topProducts = products
        .sort((a, b) => b.purchaseCount - a.purchaseCount) // Ordena por purchaseCount (más vendidos)
        .slice(0, 3); // Coge los 3 primeros

    // Productos destacados para la sección "Novedades" o "Recomendados"
    const featuredProducts = products.slice(0, 8); // Coge los primeros 8 productos como destacados

    if (loading) {
        return (
            <Container className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando productos...</span>
                </div>
                <p className="mt-2">Cargando productos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">Error al cargar los productos: {error.message}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="p-0 bg-light text-dark">
            {/* Sección de Carrusel / Héroe */}
            <Carousel fade className="mb-5 shadow-lg">
                {topProducts.map((product, index) => (
                    <Carousel.Item key={product.id} interval={3000}>
                        <img
                            className="d-block w-100 carousel-img"
                            src={product.image || '/images/placeholder-banner.jpg'} // Asegúrate de tener una imagen de banner de placeholder
                            alt={product.name}
                            style={{ height: '500px', objectFit: 'cover' }}
                        />
                        <Carousel.Caption className="carousel-caption-custom">
                            <h2 className="display-3 fw-bold text-white text-shadow-lg">{product.name}</h2>
                            <p className="lead text-white text-shadow-md">{product.description.substring(0, 100)}...</p>
                            <Button as={Link} to={`/producto/${product.id}`} variant="warning" size="lg" className="mt-3 fw-bold">
                                Ver Detalles <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <Container className="my-5">
                {/* Sección de Novedades o Productos Destacados */}
                <h2 className="text-center mb-5 display-5 fw-bold text-primary">
                    <i className="bi bi-star-fill me-3"></i>Productos Destacados
                </h2>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-5">
                    {featuredProducts.map(product => (
                        <Col key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>

                {/* Sección de Llamada a la Acción o Categorías */}
                <Row className="my-5 p-5 bg-primary text-white rounded-3 shadow-lg text-center d-flex align-items-center justify-content-center">
                    <Col md={8}>
                        <h3 className="display-6 fw-bold mb-3">¡Descubre Nuestras Últimas Ofertas!</h3>
                        <p className="lead">
                            Explora una amplia gama de productos de alta calidad al mejor precio.
                        </p>
                        <Button as={Link} to="/productos" variant="warning" size="lg" className="mt-3 fw-bold">
                            Explorar Todos los Productos <i className="bi bi-arrow-right-circle-fill ms-2"></i>
                        </Button>
                    </Col>
                </Row>

                {/* Sección de Beneficios / Confianza */}
                <Row className="text-center my-5 g-4">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm p-3">
                            <Card.Body>
                                <i className="bi bi-truck display-4 text-success mb-3"></i>
                                <h4 className="fw-bold">Envío Rápido</h4>
                                <p className="text-secondary">Entregamos tus pedidos en tiempo récord.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm p-3">
                            <Card.Body>
                                <i className="bi bi-shield-check display-4 text-info mb-3"></i>
                                <h4 className="fw-bold">Compra Segura</h4>
                                <p className="text-secondary">Tus transacciones están 100% protegidas.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm p-3">
                            <Card.Body>
                                <i className="bi bi-headset display-4 text-warning mb-3"></i>
                                <h4 className="fw-bold">Soporte 24/7</h4>
                                <p className="text-secondary">Siempre estamos aquí para ayudarte.</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Estilos CSS para el carrusel */}
            <style jsx>{`
                .carousel-img {
                    filter: brightness(60%); /* Oscurece un poco la imagen para que el texto resalte */
                }
                .carousel-caption-custom {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%;
                    text-align: center;
                    padding-bottom: 0 !important; /* Anula padding default de Bootstrap */
                    padding-top: 0 !important;
                }
                .text-shadow-lg {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                }
                .text-shadow-md {
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </Container>
    );
};

export default HomePage;