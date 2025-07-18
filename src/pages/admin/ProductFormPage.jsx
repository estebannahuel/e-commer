import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext'; // Para verificar si el usuario es admin

const ProductFormPage = () => {
    const { productId } = useParams(); // Para saber si estamos editando o creando
    const navigate = useNavigate();
    const { products, addProduct, updateProduct, loading, error } = useProducts();
    const { user, isAuthenticated } = useAuth(); // Obtener el usuario y su estado de autenticación

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '', // Aquí guardaremos la URL o la cadena Base64
    });
    const [imagePreview, setImagePreview] = useState(null); // Para mostrar la vista previa de la imagen
    const [formMessage, setFormMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Redirigir si el usuario no es admin
    useEffect(() => {
        if (!isAuthenticated || (user && user.role !== 'admin')) {
            navigate('/login'); // O a una página de acceso denegado
            alert('Acceso denegado. Debes ser administrador para acceder a esta página.');
        }
    }, [isAuthenticated, user, navigate]);

    // Cargar datos del producto si estamos en modo edición
    useEffect(() => {
        if (productId) {
            setIsEditing(true);
            if (products.length > 0) {
                const productToEdit = products.find(p => p.id === productId);
                if (productToEdit) {
                    setFormData(productToEdit);
                    setImagePreview(productToEdit.image); // Establecer la imagen actual como vista previa
                } else {
                    setFormMessage({ type: 'danger', text: 'Producto no encontrado para editar.' });
                }
            }
        } else {
            setIsEditing(false);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: '',
            });
            setImagePreview(null);
        }
    }, [productId, products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Muestra la vista previa de la imagen (Base64)
                setFormData(prev => ({ ...prev, image: reader.result })); // Guarda la imagen como Base64
            };
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos (Base64)
        } else {
            setImagePreview(null);
            setFormData(prev => ({ ...prev, image: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormMessage({ type: '', text: '' }); // Resetear mensajes

        // Validaciones básicas
        if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
            setFormMessage({ type: 'danger', text: 'Por favor, completa todos los campos obligatorios.' });
            return;
        }
        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            setFormMessage({ type: 'danger', text: 'El precio debe ser un número positivo.' });
            return;
        }
        if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            setFormMessage({ type: 'danger', text: 'El stock debe ser un número entero no negativo.' });
            return;
        }

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            // averageRating y ratingCount se inicializan en el ProductContext si es un producto nuevo
            // o se mantienen si es una edición
            averageRating: isEditing ? (formData.averageRating || 0) : 0,
            ratingCount: isEditing ? (formData.ratingCount || 0) : 0,
        };

        if (isEditing) {
            updateProduct(productData);
            setFormMessage({ type: 'success', text: 'Producto actualizado exitosamente!' });
        } else {
            addProduct(productData);
            setFormMessage({ type: 'success', text: 'Producto añadido exitosamente!' });
            // Limpiar el formulario después de añadir
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                image: '',
            });
            setImagePreview(null);
        }

        // Redirigir a la lista de productos o a un dashboard después de un tiempo
        setTimeout(() => {
            navigate('/admin/dashboard'); // Puedes ajustar la ruta
        }, 2000);
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">Error: {error.message}</Alert>
            </Container>
        );
    }

    // Si no es admin o no está autenticado, no renderizar el formulario aquí
    if (!isAuthenticated || (user && user.role !== 'admin')) {
        return null; // O podrías mostrar un mensaje de "acceso denegado"
    }

    return (
        <Container className="my-5 p-4 rounded shadow-lg bg-white">
            <h1 className="mb-4 text-center">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
            <Button variant="outline-secondary" onClick={() => navigate('/admin/dashboard')} className="mb-4">
                <i className="bi bi-arrow-left me-2"></i> Volver al Panel de Admin
            </Button>

            {formMessage.text && <Alert variant={formMessage.type}>{formMessage.text}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="productName" className="mb-3">
                            <Form.Label>Nombre del Producto</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productCategory" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productPrice" className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                step="0.01"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="productStock" className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="productDescription" className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="productImage" className="mb-3">
                            <Form.Label>Imagen del Producto</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <Card className="mt-3">
                                    <Card.Img
                                        variant="top"
                                        src={imagePreview}
                                        alt="Vista previa"
                                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                    <Card.Body className="p-2 text-center">
                                        <small className="text-muted">Vista previa de la imagen</small>
                                    </Card.Body>
                                </Card>
                            )}
                            {!imagePreview && formData.image && (
                                <Alert variant="info" className="mt-3">
                                    Si no seleccionas una nueva imagen, se mantendrá la actual.
                                </Alert>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg">
                        {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default ProductFormPage;