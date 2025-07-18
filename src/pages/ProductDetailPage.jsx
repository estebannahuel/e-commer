// src/views/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Form } from 'react-bootstrap';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import RatingStars from '../components/RatingStars';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, loading, error, addProductRating } = useProducts();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCartMessage, setAddedToCartMessage] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState(''); // <--- NUEVO ESTADO PARA EL COMENTARIO
    const [ratingSubmitted, setRatingSubmitted] = useState(false);

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find(p => String(p.id) === productId);

            if (foundProduct) {
                setProduct(foundProduct);
            } else {
                navigate('/productos', { replace: true });
                console.warn(`Producto con ID ${productId} no encontrado.`);
            }
        }
    }, [productId, products, navigate]);

    const handleAddToCart = () => {
        if (product && quantity > 0 && quantity <= product.stock) {
            addToCart(product, quantity);
            setAddedToCartMessage(`${quantity} unidad(es) de ${product.name} añadidas al carrito.`);
            setQuantity(1);
            setTimeout(() => setAddedToCartMessage(''), 3000);
        } else if (product && quantity > product.stock) {
            setAddedToCartMessage('No hay suficiente stock para la cantidad solicitada.');
        } else if (quantity <= 0) {
            setAddedToCartMessage('La cantidad debe ser al menos 1.');
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        if (userRating > 0 && userRating <= 5 && product) {
            // Llamar a addProductRating pasando el ID del producto, la valoración y el comentario
            addProductRating(product.id, userRating, userComment); // <--- PASAR userComment
            setRatingSubmitted(true);
            setUserRating(0); // Reiniciar la valoración seleccionada
            setUserComment(''); // Limpiar el comentario
            setTimeout(() => setRatingSubmitted(false), 3000);
        } else {
            alert('Por favor, selecciona una valoración de 1 a 5 estrellas.');
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando producto...</span>
                </div>
                <p className="mt-2">Cargando producto...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">Error al cargar el producto: {error.message}</Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="text-center my-5">
                <Alert variant="warning">Producto no encontrado.</Alert>
                <Button variant="primary" onClick={() => navigate('/productos')}>Volver a Productos</Button>
            </Container>
        );
    }

    const isClient = isAuthenticated && user && user.role !== 'admin';

    return (
        <Container fluid className="p-0 bg-light text-dark min-vh-100">
            <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                <Button variant="outline-secondary" onClick={() => navigate('/productos')} className="mb-4">
                    <i className="bi bi-arrow-left me-2"></i> Volver a la Lista de Productos
                </Button>

                <Row className="g-4">
                    <Col lg={6}>
                        <Card className="shadow-sm border-0 product-image-card">
                            <Card.Img
                                variant="top"
                                src={product.image || '/images/placeholder.jpg'}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: '550px', objectFit: 'contain' }}
                            />
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <div className="p-4 bg-light rounded shadow-sm">
                            <h1 className="display-5 fw-bold text-dark mb-2">{product.name}</h1>
                            <p className="text-muted fs-5 mb-3">{product.category}</p>

                            <div className="d-flex align-items-center mb-3">
                                {product.averageRating && product.ratingCount > 0 ? (
                                    <>
                                        <RatingStars rating={product.averageRating} size="1.5em" />
                                        <span className="ms-2 fs-6 text-secondary">
                                            ({product.averageRating.toFixed(1)} de 5 estrellas - {product.ratingCount} valoraciones)
                                        </span>
                                    </>
                                ) : (
                                    <Badge bg="secondary" className="p-2 fs-6">Sin valoraciones aún</Badge>
                                )}
                            </div>

                            <h2 className="text-primary display-4 fw-bold mb-4">${product.price.toFixed(2)}</h2>

                            <p className="lead text-secondary mb-4">{product.description}</p>

                            <div className="mb-4">
                                {product.stock > 0 ? (
                                    <Badge bg="success" className="p-2 fs-5">En Stock: {product.stock} unidades</Badge>
                                ) : (
                                    <Badge bg="danger" className="p-2 fs-5">Agotado</Badge>
                                )}
                            </div>

                            {isAuthenticated ? (
                                <>
                                    {product.stock > 0 && (
                                        <Row className="align-items-center mb-4">
                                            <Col xs={4} md={3}>
                                                <Form.Label htmlFor="quantity-input" className="me-2 mb-0 fw-bold">Cantidad:</Form.Label>
                                            </Col>
                                            <Col xs={5} md={4}>
                                                <Form.Control
                                                    type="number"
                                                    id="quantity-input"
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                    min="1"
                                                    max={product.stock}
                                                    className="text-center"
                                                />
                                            </Col>
                                        </Row>
                                    )}

                                    {addedToCartMessage && <Alert variant="success" className="my-3">{addedToCartMessage}</Alert>}

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-100 fw-bold py-3 mt-3"
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0 || quantity > product.stock || quantity <= 0}
                                    >
                                        <i className="bi bi-cart-plus-fill me-2"></i>
                                        {product.stock === 0 ? 'Producto Agotado' : 'Añadir al Carrito'}
                                    </Button>
                                </>
                            ) : (
                                <Alert variant="info" className="mt-4 text-center">
                                    <i className="bi bi-info-circle-fill me-2"></i>
                                    Para añadir productos al carrito, por favor <Button variant="link" onClick={() => navigate('/login')} className="p-0 align-baseline">inicia sesión</Button>.
                                </Alert>
                            )}

                            <hr className="my-4" />
                            <h3 className="mb-3">Valora este producto</h3>
                            {isClient ? (
                                <Form onSubmit={handleRatingSubmit}>
                                    <Form.Group controlId="productRating" className="mb-3">
                                        <Form.Label>Tu valoración:</Form.Label>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    style={{ cursor: 'pointer', fontSize: '2em', color: star <= userRating ? '#ffc107' : '#e4e5e9' }}
                                                    onClick={() => setUserRating(star)}
                                                >
                                                    &#9733;
                                                </span>
                                            ))}
                                        </div>
                                    </Form.Group>
                                    {/* --- NUEVO CAMPO PARA EL COMENTARIO --- */}
                                    <Form.Group controlId="productComment" className="mb-3">
                                        <Form.Label>Comentario (opcional):</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                            placeholder="Comparte tu opinión sobre el producto..."
                                        />
                                    </Form.Group>
                                    {/* --- FIN NUEVO CAMPO --- */}
                                    <Button
                                        variant="success"
                                        type="submit"
                                        disabled={userRating === 0}
                                    >
                                        Enviar Valoración
                                    </Button>
                                    {ratingSubmitted && (
                                        <Alert variant="success" className="mt-3">
                                            ¡Gracias por tu valoración!
                                        </Alert>
                                    )}
                                </Form>
                            ) : (
                                <Alert variant="info" className="mt-4 text-center">
                                    <i className="bi bi-star-fill me-2"></i>
                                    Para valorar este producto, por favor <Button variant="link" onClick={() => navigate('/login')} className="p-0 align-baseline">inicia sesión como cliente</Button>.
                                </Alert>
                            )}

                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default ProductDetailPage;