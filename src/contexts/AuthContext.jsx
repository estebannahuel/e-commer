// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import initialUsersData from '../data/users.json'; // Importa los datos de usuarios iniciales

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Estado para el usuario actualmente logueado
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Error parsing currentUser from localStorage", e);
      return null;
    }
  });

  // Estado para la lista completa de usuarios
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const storedAllUsers = localStorage.getItem('allUsers');
      // Si hay usuarios guardados, úsalos. Si no, usa los iniciales del JSON.
      return storedAllUsers ? JSON.parse(storedAllUsers) : initialUsersData;
    } catch (e) {
      console.error("Error parsing allUsers from localStorage", e);
      return initialUsersData; // Fallback al JSON inicial
    }
  });

  const navigate = useNavigate();

  // Efecto para persistir el usuario logueado
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // Efecto para persistir la lista completa de usuarios
  useEffect(() => {
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
  }, [allUsers]);


  const login = (username, password) => {
    // Busca el usuario en la lista de todos los usuarios
    const foundUser = allUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false; // Autenticación fallida
  };

  const register = (username, password, phone) => {
    // Verificar si el username ya existe
    if (allUsers.some(u => u.username === username)) {
      alert("El nombre de usuario ya está en uso.");
      return false;
    }

    const newUser = {
      // Generar un ID simple. En un entorno real, usarías UUIDs o IDs de base de datos.
      id: `user${allUsers.length > 0 ? Math.max(...allUsers.map(u => parseInt(u.id.replace('user', '') || 0))) + 1 : 1}`,
      username,
      password,
      role: 'user', // Por defecto, los registros son para usuarios normales
      phone,
      purchases: [] // Inicializar compras para el nuevo usuario
    };

    // Actualizar el estado de todos los usuarios y persistirlos
    setAllUsers(prevUsers => [...prevUsers, newUser]);

    // No logueamos automáticamente al registrar, el usuario debe ir al login.
    return true;
  };


  const logout = () => {
    setUser(null);
    navigate('/'); // Redirigir a la página de inicio al cerrar sesión
  };

  const isAdmin = user && user.role === 'admin';
  const isAuthenticated = !!user;

  // Función para obtener usuarios (útil para ManageUsers)
  const getAllUsers = () => allUsers;

  // Función para actualizar un usuario (útil para ManageUsers)
  const updateUser = (updatedUserData) => {
    setAllUsers(prevUsers =>
      prevUsers.map(u => (u.id === updatedUserData.id ? updatedUserData : u))
    );
    // Si el usuario logueado es el que se actualizó, también actualiza el estado de 'user'
    if (user && user.id === updatedUserData.id) {
      setUser(updatedUserData);
    }
  };

  // Función para eliminar un usuario (útil para ManageUsers)
  const deleteUser = (userId) => {
    setAllUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    // Si el usuario logueado es el que se eliminó, desloguéalo
    if (user && user.id === userId) {
      logout();
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout, getAllUsers, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);