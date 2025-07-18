import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useProducts } from '../../contexts/ProductContext';

const ManageProducts = () => {
    // Desestructuramos las funciones del contexto
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        image: '', // Almacenará la URL o Base64
        category: '',
        stock: '',
        averageRating: 0,
        ratingCount: 0,
        purchaseCount: 0
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (currentProduct) {
            setFormData({
                id: currentProduct.id,
                name: currentProduct.name,
                description: currentProduct.description,
                price: currentProduct.price,
                image: currentProduct.image,
                category: currentProduct.category,
                stock: currentProduct.stock,
                averageRating: currentProduct.averageRating || 0,
                ratingCount: currentProduct.ratingCount || 0,
                purchaseCount: currentProduct.purchaseCount || 0
            });
        } else {
            setFormData({
                id: '',
                name: '',
                description: '',
                price: '',
                image: '',
                category: '',
                stock: '',
                averageRating: 0,
                ratingCount: 0,
                purchaseCount: 0
            });
        }
    }, [currentProduct]);

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentProduct(null);
        setError('');
        setSuccessMessage('');
    };

    const handleShowAddModal = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setShowModal(true);
    };

    const handleShowEditModal = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' || name === 'averageRating' || name === 'ratingCount' || name === 'purchaseCount'
                ? parseFloat(value) || 0
                : value
        }));
    };

    // *** NUEVA FUNCIÓN PARA MANEJAR LA SUBIDA DE IMAGEN A BASE64 ***
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    image: reader.result // Guardar la imagen como Base64
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({
                ...prev,
                image: '' // Limpiar la imagen si no se selecciona ningún archivo
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name || !formData.price || !formData.category || formData.stock === '') {
            setError('Por favor, completa los campos obligatorios: Nombre, Precio, Categoría, Stock.');
            return;
        }
        if (isNaN(formData.price) || formData.price <= 0) {
            setError('El precio debe ser un número positivo.');
            return;
        }
        if (isNaN(formData.stock) || formData.stock < 0) {
            setError('El stock debe ser un número no negativo.');
            return;
        }
        // No validamos la imagen como obligatoria, puede ser una URL o Base64

        if (isEditing) {
            updateProduct(formData); // Usamos la función del contexto
            setSuccessMessage('Producto actualizado exitosamente.');
        } else {
            addProduct(formData); // Usamos la función del contexto
            setSuccessMessage('Producto añadido exitosamente.');
        }
        
        setTimeout(() => {
            handleCloseModal();
        }, 1500);
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            deleteProduct(productId); // Usamos la función del contexto
            setSuccessMessage('Producto eliminado exitosamente.'); // Mensaje de éxito
            setTimeout(() => {
                setSuccessMessage(''); // Limpiar el mensaje después de un tiempo
            }, 2000);
        }
    };

    return (
        <Container fluid className="admin-container">
            <Row>
                <Col md={3} className="p-0">
                    <AdminSidebar />
                </Col>
                <Col md={9} className="p-4">
                    <h1 className="mb-4 text-primary display-5 fw-bold">
                        <i className="bi bi-box-seam me-3"></i> Gestión de Productos
                    </h1>
                    <p className="lead text-secondary mb-4">
                        Aquí puedes añadir, editar y eliminar productos de tu tienda.
                    </p>

                    {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
                    {error && <Alert variant="danger" className="mb-3">{error}</Alert>}


                    <Button variant="success" className="mb-4" onClick={handleShowAddModal}>
                        <i className="bi bi-plus-circle me-2"></i> Añadir Nuevo Producto
                    </Button>

                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-dark text-white fs-5">Lista de Productos</Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive className="text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>
                                                <img
                                                    src={product.image || '/images/placeholder.jpg'} // Usa la imagen Base64 o el placeholder
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                                />
                                            </td>
                                            <td className="text-start">{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleShowEditModal(product)}
                                                >
                                                    <i className="bi bi-pencil-fill"></i>
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <i className="bi bi-trash-fill"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {products.length === 0 && (
                                <Alert variant="info" className="text-center mt-3">
                                    No hay productos para mostrar. ¡Añade uno nuevo!
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Modal para Añadir/Editar Producto */}
                    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                        <Modal.Header closeButton className="bg-primary text-white">
                            <Modal.Title>{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="productName">
                                            <Form.Label>Nombre del Producto <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="productCategory">
                                            <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="productDescription">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="productPrice">
                                            <Form.Label>Precio <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="productStock">
                                            <Form.Label>Stock <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="productImageFile">
                                    <Form.Label>Subir Imagen</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {formData.image && (
                                        <div className="mt-2 text-center">
                                            <p className="mb-1">Previsualización de la imagen:</p>
                                            <img
                                                src={formData.image}
                                                alt="Previsualización"
                                                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover', border: '1px solid #ddd', padding: '5px' }}
                                            />
                                        </div>
                                    )}
                                </Form.Group>
                                
                                {/* Si también quieres permitir URL directa, puedes añadir un campo más,
                                    pero la subida de archivo es preferible si quieres que persista la imagen. */}
                                {/*
                                <Form.Group className="mb-3" controlId="productImageUrl">
                                    <Form.Label>O URL de la Imagen (si no subes archivo)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="image"
                                        value={formData.image.startsWith('data:image/') ? '' : formData.image} // No muestra Base64 aquí
                                        onChange={handleChange}
                                        placeholder="Ej: /images/mi-producto.jpg"
                                    />
                                </Form.Group>
                                */}

                                {/* Campos de Rating y Purchase Count (solo para visualización/edición manual si es necesario) */}
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="averageRating">
                                            <Form.Label>Valoración Promedio</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="averageRating"
                                                value={formData.averageRating}
                                                onChange={handleChange}
                                                step="0.1"
                                                min="0"
                                                max="5"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="ratingCount">
                                            <Form.Label>Número de Valoraciones</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratingCount"
                                                value={formData.ratingCount}
                                                onChange={handleChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="purchaseCount">
                                            <Form.Label>Veces Comprado</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="purchaseCount"
                                                value={formData.purchaseCount}
                                                onChange={handleChange}
                                                min="0"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
};

export default ManageProducts;