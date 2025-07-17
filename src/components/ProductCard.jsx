// src/components/ProductCard.jsx (Modificado)
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RatingStars from './RatingStars'; // Importa el nuevo componente

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();

    const imageUrl = product.image || 'https://via.placeholder.com/150x150?text=No+Image';
    const averageRating = product.averageRating || 0; // Obtener el promedio de la valoración

    return (
        <Card className="h-100 shadow-sm border border-light d-flex flex-column">
            <Card.Img
                variant="top"
                src={imageUrl}
                alt={product.name}
                style={{ height: '180px', objectFit: 'contain', padding: '10px' }}
            />
            <Card.Body className="d-flex flex-column flex-grow-1">
                <Card.Title className="fw-bold text-primary">{product.name}</Card.Title>
                {/* Mostrar estrellas de valoración */}
                <div className="mb-2">
                    <RatingStars initialRating={averageRating} canRate={false} /> {/* No permitir calificar desde la tarjeta */}
                    {product.ratingCount > 0 && <span className="ms-2 text-muted">({product.ratingCount} {product.ratingCount === 1 ? 'reseña' : 'reseñas'})</span>}
                </div>
                <Card.Text className="text-secondary mb-2 flex-grow-1">
                    {product.description.substring(0, 70)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold text-success fs-5">${product.price.toFixed(2)}</span>
                    <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin Stock'}
                    </span>
                </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 pt-0 pb-3 text-center">
                <div className="d-grid gap-2">
                    {isAuthenticated && (
                        <Button
                            variant="primary"
                            as={Link}
                            to={`/producto/${product.id}`} // Ir al detalle del producto para añadir al carrito y valorar
                            className="mt-2"
                            disabled={product.stock === 0}
                        >
                            <i className="bi bi-cart-plus-fill me-2"></i> Ver Detalle
                        </Button>
                    )}

                    {!isAuthenticated && ( // Si no está autenticado, el botón principal es "Ver Detalle"
                        <Button
                            variant="primary"
                            as={Link}
                            to={`/producto/${product.id}`}
                            className="mt-2"
                        >
                            <i className="bi bi-info-circle-fill me-2"></i> Ver Detalle
                        </Button>
                    )}
                </div>
            </Card.Footer>
        </Card>
    );
};

export default ProductCard;