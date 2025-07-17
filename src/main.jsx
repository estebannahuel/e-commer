// src/main.jsx (o src/index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Asegúrate que esta sea la ruta correcta a tu componente principal
import './index.css'; // Tu CSS personalizado (si tienes)

// Importa Bootstrap CSS y Bootstrap Icons CSS directamente aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);