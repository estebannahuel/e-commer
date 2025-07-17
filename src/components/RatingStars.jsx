// src/components/RatingStars.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Necesitarás instalar react-icons si no lo tienes: npm install react-icons

const RatingStars = ({ productId, initialRating = 0, onRate, canRate = true }) => {
    const [hover, setHover] = useState(0);

    const fullStar = { color: '#ffc107' }; // Estrella amarilla
    const emptyStar = { color: '#e4e5e9' }; // Estrella gris

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ gap: '2px' }}>
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => canRate && onRate(productId, ratingValue)}
                            style={{ display: 'none' }}
                            disabled={!canRate}
                        />
                        <FaStar
                            className="star"
                            color={ratingValue <= (hover || initialRating) ? fullStar.color : emptyStar.color}
                            size={canRate ? 25 : 20} // Un poco más grandes si se pueden calificar
                            onMouseEnter={() => canRate && setHover(ratingValue)}
                            onMouseLeave={() => canRate && setHover(0)}
                            style={{ cursor: canRate ? 'pointer' : 'default', transition: 'color 200ms' }}
                        />
                    </label>
                );
            })}
            {!canRate && initialRating > 0 && (
                <span className="ms-2 text-muted">({initialRating.toFixed(1)})</span>
            )}
            {canRate && <span className="ms-2 text-muted">({initialRating.toFixed(1)})</span>}
        </div>
    );
};

export default RatingStars;