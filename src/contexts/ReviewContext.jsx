// src/contexts/ReviewContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const ReviewContext = createContext(null);

export const ReviewProvider = ({ children }) => {
    // Usamos useLocalStorage para persistir las valoraciones individuales
    const [reviews, setReviews] = useLocalStorage('ecommerceReviews', []);

    // Función para añadir una nueva valoración
    const addReview = useCallback((productId, userId, rating, comment = '') => {
        const newReview = {
            id: `REVIEW-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID único
            productId: productId,
            userId: userId,
            rating: rating,
            comment: comment,
            timestamp: new Date().toISOString(),
        };
        setReviews(prevReviews => [...prevReviews, newReview]);
        return newReview;
    }, [setReviews]);

    // Función para obtener valoraciones por producto
    const getReviewsByProductId = useCallback((productId) => {
        return reviews.filter(review => review.productId === productId);
    }, [reviews]);

    // Función para obtener valoraciones por usuario
    const getReviewsByUserId = useCallback((userId) => {
        return reviews.filter(review => review.userId === userId);
    }, [reviews]);

    // Función para obtener todas las valoraciones (útil para el admin)
    const getAllReviews = useCallback(() => {
        return reviews;
    }, [reviews]);

    const value = {
        reviews,
        addReview,
        getReviewsByProductId,
        getReviewsByUserId,
        getAllReviews,
    };

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReviews = () => {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};