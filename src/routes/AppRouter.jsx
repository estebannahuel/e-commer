import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importaciones corregidas para componentes y páginas (Mantengo tus rutas relativas)
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';

// Páginas Públicas/Generales
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CheckoutSuccessPage from '../pages/CheckoutSuccessPage';

// Páginas de Autenticación
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

// Páginas de Usuario (requieren autenticación)
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import UserProfilePage from '../pages/user/UserProfilePage';
import UserOrdersPage from '../pages/user/UserOrdersPage';

// Páginas de Administración (requieren rol de administrador)
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageUsers from '../pages/admin/ManageUsers';
// NUEVA IMPORTACIÓN para el formulario de productos
import ProductFormPage from '../pages/admin/ProductFormPage'; // ¡Asegúrate de que la ruta sea correcta!

// NUEVA IMPORTACIÓN: Página de Análisis de Productos
import ProductAnalysisPage from '../pages/admin/ProductAnalysisPage'; // <--- ¡NUEVA LÍNEA!

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Rutas con Layout (Header, Footer, etc.) */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} /> {/* Ruta principal */}
                    <Route path="productos" element={<ProductListPage />} />
                    {/* Nota: tu ruta es "producto/:productId" (singular), lo he mantenido. En mi ejemplo anterior usé "productos/:productId" (plural) */}
                    <Route path="producto/:productId" element={<ProductDetailPage />} />
                    <Route path="checkout/success" element={<CheckoutSuccessPage />} />

                    {/* Rutas de Autenticación */}
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />

                    {/* Rutas Protegidas para Usuario (rol 'user' o 'admin') */}
                    <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
                        <Route path="carrito" element={<CartPage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                        <Route path="perfil" element={<UserProfilePage />} />
                        <Route path="mis-ordenes" element={<UserOrdersPage />} />
                    </Route>

                    {/* Rutas Protegidas para Administrador (rol 'admin') */}
                    <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                        {/* Ruta para el Dashboard del Admin (ya la tenías) */}
                        <Route path="admin" element={<AdminDashboard />} />
                        {/* Ruta para gestionar productos (tu ya tenías ManageProducts, esta será la lista) */}
                        <Route path="admin/productos" element={<ManageProducts />} />
                        {/* NUEVA RUTA: Para añadir un nuevo producto */}
                        <Route path="admin/products/new" element={<ProductFormPage />} />
                        {/* NUEVA RUTA: Para editar un producto existente */}
                        <Route path="admin/products/edit/:productId" element={<ProductFormPage />} />

                        {/* Rutas de gestión de órdenes y usuarios (ya las tenías) */}
                        <Route path="admin/ordenes" element={<ManageOrders />} />
                        <Route path="admin/usuarios" element={<ManageUsers />} />

                        {/* NUEVA RUTA para la página de Análisis de Productos */}
                        <Route path="admin/product-analysis" element={<ProductAnalysisPage />} /> {/* <--- ¡NUEVA LÍNEA! */}
                    </Route>
                    {/* Ruta para 404 (puedes descomentar y crear NotFoundPage.jsx si la necesitas) */}
                    {/* <Route path="*" element={<NotFoundPage />} /> */}
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;