import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Importa el contexto de autenticación

/**
 * Componente para proteger rutas basándose en la autenticación y los roles del usuario.
 * @param {object} props - Propiedades del componente.
 * @param {string[]} [props.allowedRoles] - Un array de roles permitidos para acceder a esta ruta (ej. ['user', 'admin']).
 * Si no se proporciona, solo verifica que el usuario esté autenticado.
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth(); // Obtiene el estado de autenticación y el usuario
    
    // Si todavía está cargando el estado de autenticación, puedes mostrar un spinner o null
    // Esto es más relevante si la autenticación es asíncrona (ej. desde una API real)
    if (loading) {
        return <div>Cargando autenticación...</div>; // O un spinner real
    }

    // 1. Verificar autenticación
    if (!isAuthenticated) {
        // Si no está autenticado, redirigir a la página de login
        // 'replace' para que no se pueda volver atrás a la página protegida con el botón de retroceso
        return <Navigate to="/login" replace />;
    }

    // 2. Verificar roles si se especificaron
    if (allowedRoles && allowedRoles.length > 0) {
        if (!user || !allowedRoles.includes(user.role)) {
            // Si el usuario no tiene el rol permitido, redirigir a una página de acceso denegado o al inicio
            // Podrías crear una página específica para "Acceso Denegado"
            console.warn(`Access denied for user with role '${user?.role}' trying to access a route requiring roles: ${allowedRoles.join(', ')}`);
            return <Navigate to="/" replace />; // Redirigir al inicio por simplicidad
        }
    }

    // Si todo es correcto (autenticado y con rol permitido), renderiza el componente hijo
    return <Outlet />;
};

export default ProtectedRoute;