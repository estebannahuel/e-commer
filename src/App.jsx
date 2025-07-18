// src/App.jsx
import React from 'react';
import AppRouter from './routes/AppRouter';
import './index.css';

// Importa todos los proveedores de contexto
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { OrderProvider } from './contexts/OrderContext';
import { ReviewProvider } from './contexts/ReviewContext'; // <--- NUEVO IMPORTE

function App() {
  return (
    <AuthProvider>
      {/* ReviewProvider debe envolver a ProductProvider porque ProductProvider lo usa */}
      <ReviewProvider>
        <ProductProvider>
          {/* CartProvider y OrderProvider pueden ir después de ProductProvider */}
          <CartProvider>
            <OrderProvider>
              <AppRouter />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </ReviewProvider>
    </AuthProvider>
  );
}

export default App;