import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // <--- Importa useNavigate
import { useCart } from '../contexts/CartContext'; // Importa el contexto del carrito
import { useAuth } from '../contexts/AuthContext'; // <--- Importa el contexto de autenticación
import RatingStars from './RatingStars'; // Importa el componente de estrellas

const ProductCard = ({ product }) => {
    const { addToCart } = useCart(); // Obtén la función para añadir al carrito
    const { isAuthenticated } = useAuth(); // <--- Obtén el estado de autenticación
    const navigate = useNavigate(); // <--- Inicializa useNavigate

    const handleAddToCart = () => {
        addToCart(product);
        alert(`${product.name} añadido al carrito!`);
    };

    return (
        <Card className="h-100 shadow-sm border-0 rounded overflow-hidden product-card">
            <Link to={`/producto/${product.id}`} className="text-decoration-none">
                <Card.Img
                    variant="top"
                    src={product.image || '/images/placeholder.jpg'} // Usa una imagen de placeholder si no hay
                    alt={product.name}
                    className="product-card-img"
                    style={{ height: '200px', objectFit: 'cover' }}
                />
            </Link>
            <Card.Body className="d-flex flex-column p-3">
                <Card.Title className="fw-bold text-truncate mb-1" title={product.name}>
                    <Link to={`/producto/${product.id}`} className="text-dark text-decoration-none hover-link-primary">
                        {product.name}
                    </Link>
                </Card.Title>
                <Card.Text className="text-muted small mb-2">
                    {product.category}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Text className="fw-bold fs-5 text-primary mb-0">
                        ${product.price.toFixed(2)}
                    </Card.Text>
                    {/* Componente de estrellas de valoración */}
                    {product.averageRating && product.ratingCount > 0 ? (
                        <div className="d-flex align-items-center">
                            {/* Las estrellas de valoración se renderizan aquí */}
                            <RatingStars rating={product.averageRating} />
                            <small className="ms-1 text-secondary">({product.ratingCount})</small>
                        </div>
                    ) : (
                        <Badge bg="secondary">Sin valoraciones</Badge>
                    )}
                </div>
                {product.stock > 0 ? (
                    <Badge bg="success" className="mb-3 align-self-start">En Stock: {product.stock}</Badge>
                ) : (
                    <Badge bg="danger" className="mb-3 align-self-start">Agotado</Badge>
                )}

                {/* Lógica condicional para mostrar el botón de Añadir al Carrito */}
                {isAuthenticated ? (
                    <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        className="mt-auto w-100 fw-bold"
                        disabled={product.stock === 0} // Deshabilita si no hay stock
                    >
                        <i className="bi bi-cart-plus me-2"></i>
                        {product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                    </Button>
                ) : (
                    <Button
                        variant="outline-primary"
                        onClick={() => navigate('/login')} // Redirige a login si no está autenticado
                        className="mt-auto w-100 fw-bold"
                    >
                        <i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión para Añadir
                    </Button>
                )}
            </Card.Body>
            {/* Estilos CSS para el hover en el título */}
            <style jsx>{`
                .hover-link-primary:hover {
                    color: var(--bs-primary) !important; /* Asume que --bs-primary está definido por Bootstrap */
                    text-decoration: underline !important;
                }
                .product-card {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
            `}</style>
        </Card>
    );
};

export default ProductCard;