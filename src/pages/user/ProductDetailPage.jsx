// src/pages/user/ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Alert, Form } from 'react-bootstrap';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import RatingStars from '../../components/RatingStars'; // Importa el componente de estrellas

const ProductDetailPage = () => {
    const { id } = useParams();
    // Ahora obtenemos 'products' directamente para acceder a averageRating, ratingCount, etc.
    // Y también 'addRating' para que el usuario pueda calificar.
    const { products, getProductById, addRating } = useProducts();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addItemToCart } = useCart();
    const { isAuthenticated, user } = useAuth(); // Obtén el usuario para la valoración
    const navigate = useNavigate();

    // Sincroniza el estado 'product' local con los cambios en 'products' del contexto
    // Esto es crucial para que las estrellas se actualicen después de una valoración
    useEffect(() => {
        const foundProduct = products.find(p => p.id === id); // Busca el producto del array 'products'
        setProduct(foundProduct);
        setQuantity(1);
    }, [id, products]); // Dependencia en 'products' para que se actualice al cambiar


    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir productos al carrito.");
            navigate('/login');
            return;
        }

        if (product && quantity > 0 && quantity <= product.stock) {
            addItemToCart(product, quantity);
            alert(`${quantity} unidad(es) de ${product.name} añadidas al carrito!`);
        } else if (quantity === 0) {
            alert("La cantidad debe ser mayor que cero.");
        } else if (product && quantity > product.stock) {
            alert(`Solo quedan ${product.stock} unidades en stock.`);
        } else {
            alert("No se puede añadir el producto al carrito.");
        }
    };

    // NUEVA FUNCIÓN: Manejar la valoración del usuario
    const handleRateProduct = (productId, rating) => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para calificar productos.");
            navigate('/login');
            return;
        }
        // Lógica para añadir la valoración al producto
        addRating(productId, rating);
        alert(`¡Gracias por calificar ${product.name} con ${rating} estrellas!`);
        // Opcional: Podrías deshabilitar la calificación para este usuario después de que califique una vez
        // Esto requeriría almacenar las calificaciones por usuario en el contexto.
    };


    if (!product) {
        return (
            <Container fluid className="p-0 bg-light text-dark min-vh-100 d-flex align-items-center justify-content-center">
                <Alert variant="warning" className="text-center shadow-sm">
                    <h4 className="alert-heading"><i className="bi bi-exclamation-triangle-fill me-2"></i> Producto no encontrado</h4>
                    <p>El producto que buscas no existe o ha sido eliminado.</p>
                    <hr />
                    <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
                </Alert>
            </Container>
        );
    }

    const imageUrl = product.image || 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <Row className="align-items-center">
                    <Col md={6} className="text-center mb-4 mb-md-0">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fluid
                            rounded
                            className="shadow-sm border border-secondary"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Col>
                    <Col md={6}>
                        <h1 className="text-primary display-5 fw-bold mb-3">{product.name}</h1>
                        <p className="lead text-secondary mb-4">{product.description}</p>
                        <h2 className="text-success fw-bold mb-4">${product.price.toFixed(2)}</h2>

                        {/* Sección de Valoración */}
                        <div className="mb-3 d-flex align-items-center">
                            <span className="me-2 text-muted fw-bold">Calificación:</span>
                            <RatingStars
                                productId={product.id}
                                initialRating={product.averageRating}
                                onRate={handleRateProduct}
                                canRate={isAuthenticated} // Solo se puede calificar si está autenticado
                            />
                            {product.ratingCount > 0 && (
                                <span className="ms-2 text-muted">
                                    ({product.averageRating.toFixed(1)} de {product.ratingCount} {product.ratingCount === 1 ? 'reseña' : 'reseñas'})
                                </span>
                            )}
                            {product.ratingCount === 0 && (
                                <span className="ms-2 text-muted">(Sé el primero en calificar)</span>
                            )}
                        </div>

                        <div className="mb-3">
                            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                {product.stock > 0 ? `En Stock: ${product.stock}` : 'Sin Stock'}
                            </span>
                        </div>

                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Cantidad:</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max={product.stock > 0 ? product.stock : 0}
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    const maxAllowed = product.stock > 0 ? product.stock : 0;
                                    setQuantity(Math.max(1, Math.min(val, maxAllowed)));
                                }}
                                style={{ width: '100px' }}
                                disabled={product.stock === 0}
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                size="lg"
                                className="shadow-sm mb-2"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || quantity > product.stock || quantity === 0}
                            >
                                <i className="bi bi-cart-plus-fill me-2"></i> Añadir al Carrito
                            </Button>
                            <Link to="/productos" className="btn btn-outline-secondary">
                                <i className="bi bi-arrow-left-circle me-2"></i> Volver a Productos
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default ProductDetailPage;