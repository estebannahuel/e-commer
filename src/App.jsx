// src/App.jsx
import React from 'react';
import AppRouter from './routes/AppRouter'; // Importa tu router principal
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'; // Tu CSS personalizado

function App() {
  return (
    <AppRouter /> // Simplemente renderiza tu AppRouter
  );
}

export default App;