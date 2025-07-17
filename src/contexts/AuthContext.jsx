// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'; // <-- Asegúrate de que useState y useEffect estén aquí
import { useNavigate } from 'react-router-dom';
import initialUsersData from '../data/users.json'; // Asegúrate de que este archivo exista
import useLocalStorage from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('currentUser', null);
    const [allUsers, setAllUsers] = useLocalStorage('allUsers', initialUsersData);

    const navigate = useNavigate();

    const login = (username, password) => {
        const foundUser = allUsers.find(
            u => u.username === username && u.password === password
        );

        if (foundUser) {
            setUser(foundUser);
            // La redirección aquí puede ser redundante si ya la tienes en LoginPage
            // navigate(foundUser.role === 'admin' ? '/admin' : '/', { replace: true });
            return true;
        }
        return false;
    };

    const register = (username, password, phone) => { // Añadido 'phone'
        if (allUsers.some(u => u.username === username)) {
            // No uses alert(), es mejor manejar el error con un estado en el componente
            // alert("El nombre de usuario ya está en uso.");
            return false; // Indicamos que el registro falló
        }

        const newUser = {
            id: `user${allUsers.length > 0 ? Math.max(...allUsers.map(u => parseInt(u.id.replace('user', '') || 0))) + 1 : 1}`,
            username,
            password,
            role: 'user', // Rol por defecto para nuevos registros
            phone, // Guardar el teléfono
            purchases: [] // Inicializar compras
        };

        setAllUsers(prevUsers => [...prevUsers, newUser]);
        return true; // Indicamos que el registro fue exitoso
    };

    const logout = () => {
        setUser(null);
        navigate('/');
    };

    const isAdmin = user && user.role === 'admin';
    const isAuthenticated = !!user;

    const getAllUsers = () => allUsers;

    const updateUser = (updatedUserData) => {
        setAllUsers(prevUsers =>
            prevUsers.map(u => (u.id === updatedUserData.id ? updatedUserData : u))
        );
        if (user && user.id === updatedUserData.id) {
            setUser(updatedUserData);
        }
    };

    const deleteUser = (userId) => {
        setAllUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
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