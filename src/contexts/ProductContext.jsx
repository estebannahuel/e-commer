// src/contexts/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialProductsData from '../data/products.json';
import { useReviews } from './ReviewContext'; // <--- IMPORTAR EL NUEVO CONTEXTO DE REVIEWS
import { useAuth } from './AuthContext'; // <--- IMPORTAR EL AUTH CONTEXT PARA EL USUARIO ACTUAL

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addReview } = useReviews(); // <--- USAR LA FUNCIÓN addReview DEL NUEVO CONTEXTO
    const { user } = useAuth(); // <--- OBTENER EL USUARIO ACTUAL DEL AUTH CONTEXT

    const LOCAL_STORAGE_KEY = 'e-commerce-products';

    // Cargar productos desde localStorage o desde los datos iniciales
    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(initialProductsData);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProductsData));
            }
        } catch (err) {
            console.error("Fallo al cargar productos desde localStorage:", err);
            setError(new Error("Error al cargar los productos."));
            setProducts(initialProductsData);
        } finally {
            setLoading(false);
        }
    }, []);

    // Guardar productos en localStorage cada vez que el estado 'products' cambie
    useEffect(() => {
        if (!loading) {
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
            } catch (err) {
                console.error("Fallo al guardar productos en localStorage:", err);
                setError(new Error("Error al guardar los productos."));
            }
        }
    }, [products, loading]);

    const getProductById = useCallback((id) => {
        return products.find(product => product.id === id);
    }, [products]);

    const addProduct = useCallback((newProduct) => {
        setProducts(prevProducts => {
            const productToAdd = { ...newProduct, id: String(Date.now()) };
            return [...prevProducts, productToAdd];
        });
    }, []);

    const updateProduct = useCallback((updatedProduct) => {
        setProducts(prevProducts => {
            return prevProducts.map(p =>
                p.id === updatedProduct.id ? updatedProduct : p
            );
        });
    }, []);

    const deleteProduct = useCallback((productId) => {
        setProducts(prevProducts => {
            return prevProducts.filter(p => p.id !== productId);
        });
    }, []);

    // MODIFICADA: Función para añadir una valoración a un producto
    // Ahora recibe también el userId (y opcionalmente un comentario)
    const addProductRating = useCallback((productId, newRating, comment = '') => {
        if (!user || !user.id) { // Asegurarse de que hay un usuario logueado
            console.warn("No se puede añadir valoración: Usuario no logueado.");
            setError(new Error("Debes iniciar sesión para valorar un producto."));
            return;
        }

        // 1. Guardar la valoración individual en ReviewContext
        addReview(productId, user.id, newRating, comment); // <--- LLAMADA AL NUEVO CONTEXTO

        // 2. Actualizar el promedio y el conteo en ProductContext
        setProducts(prevProducts => {
            return prevProducts.map(p => {
                if (p.id === productId) {
                    const currentRatingSum = (p.averageRating || 0) * (p.ratingCount || 0);
                    const newRatingCount = (p.ratingCount || 0) + 1;
                    const newAverageRating = (currentRatingSum + newRating) / newRatingCount;

                    return {
                        ...p,
                        averageRating: parseFloat(newAverageRating.toFixed(1)),
                        ratingCount: newRatingCount,
                    };
                }
                return p;
            });
        });
    }, [user, addReview, setProducts]); // Asegúrate de que 'user' y 'addReview' son dependencias

    const value = {
        products,
        loading,
        error,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        addProductRating,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};