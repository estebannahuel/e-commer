// src/contexts/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'; // <-- Asegúrate de que useState y useEffect estén aquí
import productsData from '../data/products.json'; // Asegúrate de que este archivo exista
import useLocalStorage from '../hooks/useLocalStorage';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    const initialProductsState = productsData.map(p => ({
        ...p,
        ratingSum: p.ratingSum || 0,
        ratingCount: p.ratingCount || 0,
        purchaseCount: p.purchaseCount || 0,
    }));

    const [products, setProducts] = useLocalStorage('ecommerceProducts', initialProductsState);

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
                ratingSum: 0,
                ratingCount: 0,
                purchaseCount: 0,
            }];
        });
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prevProducts =>
            prevProducts.map(p => {
                if (p.id === updatedProduct.id) {
                    return { ...p, ...updatedProduct };
                }
                return p;
            })
        );
    };

    const deleteProduct = (id) => {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    };

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

    const productsWithAverageRating = products.map(p => ({
        ...p,
        averageRating: p.ratingCount > 0 ? (p.ratingSum / p.ratingCount) : 0,
    }));

    return (
        <ProductContext.Provider value={{
            products: productsWithAverageRating,
            getProductById,
            addProduct,
            updateProduct,
            deleteProduct,
            addRating,
            incrementPurchaseCount
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);