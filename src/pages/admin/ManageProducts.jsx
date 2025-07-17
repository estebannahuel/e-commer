// src/pages/admin/ManageProducts.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Alert, Modal, Card } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import { useProducts } from '../../contexts/ProductContext';
import RatingStars from '../../components/RatingStars'; // Importa el componente de estrellas

const ManageProducts = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formProduct, setFormProduct] = useState({ id: '', name: '', price: '', description: '', category: '', stock: '', image: '' });
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!showModal) {
            setPreviewImage(null);
            setImageFile(null);
            setError('');
            setSuccess('');
        }
    }, [showModal]);

    const handleShowModal = (product = null) => {
        setEditingProduct(product);
        if (product) {
            setFormProduct({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                stock: product.stock,
                image: product.image
            });
            setPreviewImage(product.image);
            setImageFile(null);
        } else {
            setFormProduct({ id: '', name: '', price: '', description: '', category: '', stock: '', image: '' });
            setPreviewImage(null);
            setImageFile(null);
        }
        setError('');
        setSuccess('');
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
            setFormProduct(prev => ({ ...prev, image: '' }));
        } else {
            setImageFile(null);
            setPreviewImage(editingProduct ? editingProduct.image : null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formProduct.name || !formProduct.price || !formProduct.description || !formProduct.category || !formProduct.stock) {
            setError('Nombre, precio, descripción, categoría y stock son obligatorios.');
            return;
        }

        if (!editingProduct && !imageFile) {
            setError('Por favor, selecciona una imagen para el nuevo producto.');
            return;
        }
        if (editingProduct && !imageFile && !editingProduct.image) {
            setError('Por favor, selecciona una imagen para actualizar o carga una nueva.');
            return;
        }

        const parsedPrice = parseFloat(formProduct.price);
        const parsedStock = parseInt(formProduct.stock);

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            setError('El precio debe ser un número positivo.');
            return;
        }
        if (isNaN(parsedStock) || parsedStock < 0) {
            setError('El stock debe ser un número no negativo.');
            return;
        }

        let imageUrlToSave = formProduct.image;

        if (imageFile) {
            imageUrlToSave = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(imageFile);
            });
        } else if (editingProduct && editingProduct.image && !imageUrlToSave) {
            imageUrlToSave = editingProduct.image;
        } else if (!editingProduct && !imageUrlToSave) {
            imageUrlToSave = '';
        }

        const productToSave = {
            ...formProduct,
            price: parsedPrice,
            stock: parsedStock,
            image: imageUrlToSave,
            // Mantener los campos de valoración y compra si se está editando
            // Si es un producto nuevo, ProductContext los inicializará en 0
            ...(editingProduct && {
                ratingSum: editingProduct.ratingSum,
                ratingCount: editingProduct.ratingCount,
                purchaseCount: editingProduct.purchaseCount,
            })
        };

        if (editingProduct) {
            updateProduct(productToSave);
            setSuccess('Producto actualizado con éxito.');
        } else {
            addProduct(productToSave);
            setSuccess('Producto añadido con éxito.');
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            deleteProduct(id);
            setSuccess('Producto eliminado con éxito.');
        }
    };

    return (
        <Container fluid className="p-0 min-vh-100 bg-light">
            <Row className="g-0">
                <Col md={2}>
                    <AdminSidebar />
                </Col>
                <Col md={10} className="p-4">
                    <Container className="my-5 p-4 rounded shadow-sm border border-light bg-white">
                        <h1 className="text-center mb-4 text-primary display-4 fw-bold">
                            <i className="bi bi-box-seam me-3"></i> Gestión de Productos
                        </h1>
                        <p className="lead text-secondary text-center mb-5">
                            Administra tu catálogo de productos: añade, edita o elimina.
                        </p>

                        <div className="d-flex justify-content-end mb-4">
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <i className="bi bi-plus-circle-fill me-2"></i> Añadir Nuevo Producto
                            </Button>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        {products.length === 0 ? (
                            <Alert variant="info" className="text-center">No hay productos para mostrar.</Alert>
                        ) : (
                            <Table striped bordered hover responsive className="shadow-sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Categoría</th>
                                        <th>Valoración</th> {/* Nueva columna */}
                                        <th>Vendidos</th>   {/* Nueva columna */}
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>
                                                <img
                                                    src={product.image || 'https://via.placeholder.com/50x50?text=No+Image'}
                                                    alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>${parseFloat(product.price).toFixed(2)}</td>
                                            <td>{product.stock}</td>
                                            <td>{product.category}</td>
                                            <td>
                                                {/* Mostrar estrellas de valoración */}
                                                <div className="d-flex align-items-center">
                                                    <RatingStars initialRating={product.averageRating} canRate={false} size={15} /> {/* Tamaño más pequeño */}
                                                    {product.ratingCount > 0 && (
                                                        <span className="ms-1 text-muted small">
                                                            ({product.averageRating.toFixed(1)}) <br/> ({product.ratingCount} {product.ratingCount === 1 ? 'reseña' : 'reseñas'})
                                                        </span>
                                                    )}
                                                    {product.ratingCount === 0 && (
                                                        <span className="ms-1 text-muted small">(Sin reseñas)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{product.purchaseCount}</td> {/* Mostrar conteo de compras */}
                                            <td>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(product)}>
                                                    <i className="bi bi-pencil-fill"></i>
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                                                    <i className="bi bi-trash-fill"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Container>
                </Col>
            </Row>

            {/* Modal para Añadir/Editar Producto */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingProduct ? 'Editar Producto' : 'Añadir Producto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={6}>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" name="name" value={formProduct.name} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control type="number" step="0.01" name="price" value={formProduct.price} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" value={formProduct.description} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría</Form.Label>
                                    <Form.Control type="text" name="category" value={formProduct.category} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control type="number" name="stock" value={formProduct.stock} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Cargar Imagen</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required={!editingProduct && !formProduct.image}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    {editingProduct ? 'Guardar Cambios' : 'Añadir Producto'}
                                </Button>
                            </Form>
                        </Col>

                        <Col md={6}>
                            <h4 className="text-center mb-3">Vista Previa del Producto</h4>
                            <Card className="text-center shadow-sm">
                                {previewImage ? (
                                    <Card.Img
                                        variant="top"
                                        src={previewImage}
                                        alt={formProduct.name || 'Vista previa de imagen'}
                                        style={{ maxHeight: '250px', objectFit: 'contain', padding: '10px' }}
                                    />
                                ) : (
                                    <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', color: '#666' }}>
                                        No hay imagen seleccionada
                                    </div>
                                )}
                                <Card.Body>
                                    <Card.Title>{formProduct.name || 'Nombre del Producto'}</Card.Title>
                                    <Card.Text>
                                        <strong>Precio:</strong> ${parseFloat(formProduct.price || 0).toFixed(2)}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Stock:</strong> {formProduct.stock || '0'} unidades
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Categoría:</strong> {formProduct.category || 'Sin Categoría'}
                                    </Card.Text>
                                    <Card.Text className="text-muted small">
                                        {formProduct.description || 'Descripción del producto...'}
                                    </Card.Text>
                                    {/* Mostrar valoración en la vista previa del modal */}
                                    {editingProduct && (
                                        <Card.Text className="mb-2">
                                            <strong>Calificación:</strong>{' '}
                                            <RatingStars initialRating={editingProduct.averageRating} canRate={false} size={18} />
                                            {editingProduct.ratingCount > 0 && (
                                                <span className="ms-1 text-muted small">
                                                    ({editingProduct.averageRating.toFixed(1)}) ({editingProduct.ratingCount} {editingProduct.ratingCount === 1 ? 'reseña' : 'reseñas'})
                                                </span>
                                            )}
                                            {editingProduct.ratingCount === 0 && (
                                                <span className="ms-1 text-muted small">(Sin reseñas)</span>
                                            )}
                                        </Card.Text>
                                    )}
                                    {editingProduct && (
                                        <Card.Text>
                                            <strong>Vendidos:</strong> {editingProduct.purchaseCount} unidades
                                        </Card.Text>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManageProducts;