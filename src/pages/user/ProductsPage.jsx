// src/pages/user/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import productsData from '../../data/products.json'; // Asegúrate de la ruta
import ProductCard from '../../components/ProductCard'; // Asegúrate de la ruta

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productsData);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const results = productsData.filter(product =>
      product.name.toLowerCase().includes(lowercasedSearchTerm) ||
      product.description.toLowerCase().includes(lowercasedSearchTerm) ||
      product.category.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProducts(results);
  }, [searchTerm]);

  return (
    <Container fluid className="p-0 bg-light text-dark min-vh-100">
      <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
        <h1 className="text-center mb-4 text-primary display-4 fw-bold">
          <i className="bi bi-box-fill me-3"></i> Todos los Productos
        </h1>
        <p className="lead text-secondary text-center mb-5">
          Aquí puedes encontrar la lista completa de todos nuestros productos disponibles.
        </p>

        {/* Barra de búsqueda */}
        <InputGroup className="mb-5 shadow-sm rounded-pill overflow-hidden">
          <FormControl
            placeholder="Buscar productos por nombre, descripción o categoría..."
            aria-label="Buscar productos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-primary py-2 px-4 rounded-pill-start"
            style={{borderRight: 'none'}}
          />
          <Button variant="primary" className="px-4 rounded-pill-end">
            <i className="bi bi-search me-2"></i> Buscar
          </Button>
        </InputGroup>

        {filteredProducts.length > 0 ? (
          <Row xs={1} md={2} lg={3} xl={4} className="g-4">
            {filteredProducts.map(product => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="warning" className="text-center shadow-sm py-4">
            <h4 className="alert-heading"><i className="bi bi-exclamation-triangle-fill me-2"></i> No se encontraron productos</h4>
            <p className="mb-0">Ajusta tu búsqueda o explora otras categorías.</p>
          </Alert>
        )}
      </Container>
    </Container>
  );
};

export default ProductsPage;