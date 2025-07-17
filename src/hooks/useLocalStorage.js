// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Estado para almacenar nuestro valor
    // Pasa una función a useState para que el cálculo inicial solo se ejecute una vez
    const [storedValue, setStoredValue] = useState(() => {
        // Asegúrate de que el código solo se ejecute en el lado del cliente (navegador)
        if (typeof window === 'undefined') {
            return initialValue; // Retorna el valor inicial si no hay window (entorno de servidor/build)
        }
        try {
            // Obtener el valor del localStorage por su clave
            const item = window.localStorage.getItem(key);
            // Parsear JSON si se encuentra, de lo contrario, usar el valor inicial
            // Se usa el valor inicial por defecto, incluso si el parseo falla
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // Si hay un error (ej. JSON corrupto), imprimir en consola y usar el valor inicial
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    // useEffect para sincronizar el estado con localStorage cada vez que cambia el valor
    useEffect(() => {
        // Asegúrate de que el código solo se ejecute en el lado del cliente (navegador)
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                // Si hay un error al guardar, imprimir en consola
                console.error(`Error writing localStorage key “${key}”:`, error);
            }
        }
    }, [key, storedValue]); // Dependencias: la clave y el valor almacenado

    return [storedValue, setStoredValue];
}

export default useLocalStorage;