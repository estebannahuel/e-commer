// src/contexts/AuthContext.jsx (Tu código actual es correcto, sin cambios necesarios para esta tarea)
import React, { createContext, useContext, useState, useEffect } from 'react';
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
            return true;
        }
        return false;
    };

    const register = (username, password, phone) => { // Añadido 'phone'
        if (allUsers.some(u => u.username === username)) {
            return false;
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
        return true;
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