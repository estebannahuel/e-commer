import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Asegúrate de que esta ruta sea correcta para tu AuthContext

/**
 * Componente PrivateRoute para proteger rutas.
 * Redirige a /login si el usuario no está autenticado.
 * Redirige a /unauthorized si el usuario no tiene los roles permitidos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {Array<string>} props.allowedRoles - Array de roles permitidos para acceder a esta ruta (ej: ['user', 'admin']).
 */
const PrivateRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth(); // Obtén el estado de autenticación, el usuario y el estado de carga

    // Muestra un indicador de carga mientras se verifica la autenticación
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    // 1. Si no está autenticado, redirige a la página de login.
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // 'replace' evita que el usuario regrese a la página protegida con el botón de atrás
    }

    // 2. Si está autenticado pero no tiene un rol o el rol no está permitido.
    //    Esto asume que el objeto `user` tiene una propiedad `role` (ej: 'user', 'admin').
    const userRole = user?.role; // Usa optional chaining por si 'user' es null temporalmente

    if (allowedRoles && allowedRoles.length > 0) {
        if (!userRole || !allowedRoles.includes(userRole)) {
            // Puedes redirigir a una página de "Acceso Denegado" o al dashboard principal.
            // Para este ejemplo, redirigiremos al inicio o a una página de "No autorizado".
            // Podrías crear una `UnauthorizedPage.jsx` para esto.
            return <Navigate to="/" replace />; // O a '/unauthorized' si la creas
        }
    }

    // 3. Si está autenticado y el rol es permitido, renderiza el componente hijo de la ruta.
    return <Outlet />;
};

export default PrivateRoute;