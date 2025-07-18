import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header'; // Componente de encabezado
import Footer from './Footer'; // Componente de pie de página

const Layout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1"> {/* Ocupa el espacio restante */}
                <Outlet /> {/* Aquí se renderizarán los componentes de la ruta actual */}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;