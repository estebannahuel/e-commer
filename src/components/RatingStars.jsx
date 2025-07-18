import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Importa iconos de estrellas

const RatingStars = ({ rating, maxRating = 5, color = '#ffc107', size = '1.2em' }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // Verifica si hay parte decimal (media estrella), pero solo si la parte decimal es significativa
    // (ej. 4.5 debe tener media estrella, 4.0 no)
    const hasHalfStar = rating % 1 !== 0 && (rating % 1) >= 0.25 && (rating % 1) <= 0.75; 
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} color={color} style={{ fontSize: size }} />);
    }

    // Media estrella (si aplica)
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" color={color} style={{ fontSize: size }} />);
    }

    // Estrellas vacías
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} color={color} style={{ fontSize: size }} />);
    }

    return (
        <div className="d-flex align-items-center">
            {stars.map((star, index) => (
                <span key={index} className="me-1">
                    {star}
                </span>
            ))}
        </div>
    );
};

export default RatingStars;