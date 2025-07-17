// src/contexts/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'; // Importa useEffect
import productsData from '../data/products.json';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    // Inicializamos el estado de los productos
    // Añadimos campos para rating y purchaseCount, inicializándolos si no existen
    const [products, setProducts] = useState(() => {
        // Intentar cargar desde localStorage para persistencia de sesión
        try {
            const storedProducts = localStorage.getItem('ecommerceProducts');
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                // Asegurarse de que los productos existentes tengan los nuevos campos
                return parsedProducts.map(p => ({
                    ...p,
                    ratingSum: p.ratingSum || 0,
                    ratingCount: p.ratingCount || 0,
                    purchaseCount: p.purchaseCount || 0,
                }));
            }
        } catch (e) {
            console.error("Error al cargar productos de localStorage", e);
        }
        // Si no hay en localStorage o hay un error, usa los datos iniciales
        // y añade los nuevos campos con valores por defecto
        return productsData.map(p => ({
            ...p,
            ratingSum: 0,
            ratingCount: 0,
            purchaseCount: 0,
        }));
    });

    // Efecto para persistir los productos en localStorage cada vez que cambian
    useEffect(() => {
        localStorage.setItem('ecommerceProducts', JSON.stringify(products));
    }, [products]);


    const getProductById = (id) => products.find(p => p.id === id);

    const addProduct = (newProduct) => {
        setProducts(prevProducts => {
            const currentMaxId = prevProducts.length > 0
                ? Math.max(...prevProducts.map(p => parseInt(p.id) || 0))
                : 0;
            const newId = String(currentMaxId + 1);

            return [...prevProducts, {
                ...newProduct,
                id: newId,
                ratingSum: 0,       // Nuevos campos inicializados
                ratingCount: 0,
                purchaseCount: 0,
            }];
        });
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prevProducts =>
            prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
    };

    const deleteProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    };

    // NUEVA FUNCIÓN: Añadir una valoración a un producto
    const addRating = (productId, rating) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === productId) {
                    return {
                        ...p,
                        ratingSum: p.ratingSum + rating,
                        ratingCount: p.ratingCount + 1,
                    };
                }
                return p;
            })
        );
    };

    // NUEVA FUNCIÓN: Incrementar la cuenta de compras de un producto
    const incrementPurchaseCount = (productId, quantity) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === productId) {
                    return {
                        ...p,
                        purchaseCount: p.purchaseCount + quantity,
                    };
                }
                return p;
            })
        );
    };

    // Calcular la calificación promedio al momento de acceder a los productos
    const productsWithAverageRating = products.map(p => ({
        ...p,
        averageRating: p.ratingCount > 0 ? (p.ratingSum / p.ratingCount) : 0,
    }));


    return (
        <ProductContext.Provider value={{
            products: productsWithAverageRating, // Se expone los productos con el promedio calculado
            getProductById,
            addProduct,
            updateProduct,
            deleteProduct,
            addRating,                  // Exponer la nueva función
            incrementPurchaseCount      // Exponer la nueva función
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);