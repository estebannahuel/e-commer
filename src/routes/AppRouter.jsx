// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de Layout
import Header from '../components/Header';
import Footer from '../components/Footer';

// Páginas de Usuario
import HomePage from '../pages/user/HomePage';
import ProductsPage from '../pages/user/ProductsPage';
import ProductDetailPage from '../pages/user/ProductDetailPage';
import CartPage from '../pages/user/CartPage';
import UserProfilePage from '../pages/user/UserProfilePage';

// NUEVAS PÁGINAS DE USUARIO PARA CHECKOUT Y ÓRDENES
import CheckoutPage from '../pages/user/CheckoutPage'; // <-- NUEVA IMPORTACIÓN
import CheckoutSuccessPage from '../pages/user/CheckoutSuccessPage'; // <-- NUEVA IMPORTACIÓN
import MyOrdersPage from '../pages/user/MyOrdersPage'; // <-- NUEVA IMPORTACIÓN

// Páginas de Autenticación
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Páginas de Administración
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageUsers from '../pages/admin/ManageUsers';

// Página de Error
import NotFoundPage from '../pages/NotFoundPage';

// Componentes y Contextos de Autenticación
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Otros Context Providers
import { ProductProvider } from '../contexts/ProductContext';
import { CartProvider } from '../contexts/CartContext';
import { OrderProvider } from '../contexts/OrderContext';

const AppRouter = () => {
    return (
        <Router>
            <AuthProvider>
                <ProductProvider>
                    <CartProvider>
                        <OrderProvider>

                            <Header />
                            <main style={{ minHeight: '80vh' }} className="py-4">
                                <Routes>
                                    {/* Rutas Públicas */}
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/productos" element={<ProductsPage />} />
                                    <Route path="/producto/:id" element={<ProductDetailPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />

                                    {/* Rutas Protegidas para usuarios y administradores */}
                                    <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                                        <Route path="/carrito" element={<CartPage />} />
                                        <Route path="/perfil" element={<UserProfilePage />} />
                                        {/* NUEVAS RUTAS PROTEGIDAS */}
                                        <Route path="/checkout" element={<CheckoutPage />} /> {/* Página de Checkout */}
                                        <Route path="/checkout/success" element={<CheckoutSuccessPage />} /> {/* Página de éxito de pago */}
                                        <Route path="/mis-ordenes" element={<MyOrdersPage />} /> {/* Página para ver las órdenes del usuario */}
                                    </Route>

                                    {/* Rutas de Administración (Solo para admins) */}
                                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                        <Route path="/admin" element={<AdminDashboard />} />
                                        <Route path="/admin/productos" element={<ManageProducts />} />
                                        <Route path="/admin/ordenes" element={<ManageOrders />} />
                                        <Route path="/admin/usuarios" element={<ManageUsers />} />
                                    </Route>

                                    {/* Ruta para 404 */}
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </main>
                            <Footer />

                        </OrderProvider>
                    </CartProvider>
                </ProductProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRouter;