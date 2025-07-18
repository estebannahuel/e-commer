import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Pagination, Alert } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext'; // Para obtener los productos

const ProductListPage = () => {
    const { products, loading, error } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8; // Número de productos por página

    // Obtener categorías únicas de los productos
    const categories = useMemo(() => {
        const uniqueCategories = new Set(products.map(p => p.category));
        return ['Todas', ...Array.from(uniqueCategories)];
    }, [products]);

    // Filtrar productos basados en el término de búsqueda y la categoría seleccionada
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    // Calcular productos para la página actual
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calcular número total de páginas
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Resetear la página a 1 cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

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
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                    <i className="bi bi-shop me-3"></i>Nuestros Productos
                </h1>
                <p className="lead text-secondary text-center mb-5">
                    Explora nuestra amplia selección de productos de alta calidad.
                </p>

                {/* Barra de búsqueda y filtros */}
                <Row className="mb-4 align-items-center">
                    <Col md={6} className="mb-3 mb-md-0">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Buscar productos por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                                <i className="bi bi-x-lg"></i>
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <Form.Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={2} className="text-md-end">
                        <Button variant="outline-primary" onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }}>
                            <i className="bi bi-funnel-fill me-2"></i> Resetear
                        </Button>
                    </Col>
                </Row>

                {/* Lista de productos */}
                {currentProducts.length === 0 ? (
                    <Alert variant="info" className="text-center mt-5 py-4">
                        <h4 className="alert-heading"><i className="bi bi-exclamation-circle-fill me-2"></i> No se encontraron productos</h4>
                        <p className="mb-0">Ajusta tus filtros o prueba con otra búsqueda.</p>
                    </Alert>
                ) : (
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-5">
                        {currentProducts.map(product => (
                            <Col key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}

                {/* Paginación */}
                {filteredProducts.length > productsPerPage && (
                    <Row className="mt-5">
                        <Col className="d-flex justify-content-center">
                            <Pagination>
                                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                            </Pagination>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
};

export default ProductListPage;