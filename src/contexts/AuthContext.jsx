import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import initialUsersData from '../data/users.json'; // Importa tus datos de usuarios iniciales

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('currentUser', null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    const [allUsers, setAllUsers] = useLocalStorage('allUsers', initialUsersData); // <-- Mantener esta línea

    useEffect(() => {
        setIsAuthenticated(!!user);
    }, [user]);

    const login = useCallback((username, password) => {
        const foundUser = allUsers.find(
            u => u.username === username && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    }, [allUsers, setUser]);

    const register = useCallback((newUserData) => {
        const usernameExists = allUsers.some(u => u.username === newUserData.username);
        if (usernameExists) {
            return { success: false, message: "El nombre de usuario ya existe." };
        }

        const newUserId = `user${Date.now()}`;
        const newUser = {
            id: newUserId,
            role: 'user',
            ...newUserData
        };

        setAllUsers(prevUsers => {
            const currentUsers = Array.isArray(prevUsers) ? prevUsers : [];
            return [...currentUsers, newUser];
        });
        
        setUser(newUser);
        return { success: true, user: newUser };
    }, [allUsers, setAllUsers, setUser]);

    const logout = useCallback(() => {
        setUser(null);
    }, [setUser]);

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        register,
        allUsers, // <--- ¡NUEVO: Exponer allUsers en el contexto!
        setAllUsers // <--- Opcional, pero útil si alguna vez necesitas modificar la lista de usuarios fuera de register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};