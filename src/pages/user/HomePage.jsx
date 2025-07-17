// src/pages/user/HomePage.jsx (Modificado)
import React from 'react';
import { Container, Row, Col, Card, Button, Carousel, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../contexts/ProductContext'; // Importar useProducts

const HomePage = () => {
    const { products } = useProducts(); // Obtener los productos del contexto

    // Filtrar y ordenar productos para la sección "Más Vendidos"
    // Tomamos una copia para no modificar el array original y los ordenamos
    const mostPurchasedProducts = [...products]
        .sort((a, b) => b.purchaseCount - a.purchaseCount) // Ordenar de mayor a menor purchaseCount
        .slice(0, 3); // Tomar los 3 primeros (o la cantidad que desees)

    // Puedes seguir usando el slice para ofertas si quieres productos específicos o basados en alguna propiedad de "oferta"
    // Por ahora, simplemente tomamos los 3 primeros del array general de productos (después de cualquier ordenamiento si se aplica)
    const featuredProducts = products.slice(0, 3); // O podrías tener un campo 'isFeatured' en tus productos

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            {/* Carrousel de Ofertas / Novedades */}
            <Carousel fade interval={8000} className="mb-5 shadow-lg">
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/banner.jpg"
                        alt="Oferta 1"
                        style={{ height: '500px', objectFit: 'cover' }}
                    />
                    <Carousel.Caption className="text-start">
                        <h3 className="display-4 fw-bold text-white">Descuentos Increíbles</h3>
                        <p className="lead text-light">Encuentra los mejores productos a precios que no podrás creer.</p>
                        <Button variant="info" size="lg" as={Link} to="/productos">Ver Ofertas</Button>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/banner2.jpg"
                        alt="Novedad 2"
                        style={{ height: '500px', objectFit: 'cover' }}
                    />
                    <Carousel.Caption className="text-end">
                        <h3 className="display-4 fw-bold text-white">Lo Último en Gadgets</h3>
                        <p className="lead text-light">Explora nuestra colección de los gadgets más innovadores.</p>
                        <Button variant="outline-light" size="lg" as={Link} to="/productos">Explorar Novedades</Button>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="my-5">
                {/* Sección de Productos Destacados / Ofertas */}
                <h2 className="text-center mb-5 text-primary display-5 fw-bold">
                    <i className="bi bi-tags-fill me-3"></i> Ofertas Destacadas
                </h2>
                {featuredProducts.length > 0 ? (
                    <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                        {featuredProducts.map(product => (
                            <Col key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Alert variant="info" className="text-center mb-5">No hay ofertas destacadas en este momento.</Alert>
                )}

                {/* Sección de Productos Más Vendidos (ahora dinámico) */}
                <h2 className="text-center mb-5 text-primary display-5 fw-bold">
                    <i className="bi bi-graph-up-arrow me-3"></i> Más Vendidos
                </h2>
                {mostPurchasedProducts.length > 0 ? (
                    <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                        {mostPurchasedProducts.map(product => (
                            <Col key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Alert variant="info" className="text-center mb-5">No hay productos más vendidos disponibles.</Alert>
                )}

                {/* Banner de Categorías */}
                <Card className="text-center bg-info text-white my-5 shadow-lg">
                    <Card.Body className="py-5">
                        <h2 className="display-5 fw-bold mb-3">Encuentra lo que Buscas</h2>
                        <p className="lead mb-4">Descubre productos por categoría, desde laptops hasta accesorios.</p>
                        <Button variant="outline-light" size="lg" as={Link} to="/productos">Explorar Todas las Categorías</Button>
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    );
};

export default HomePage;