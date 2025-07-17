// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Usa una función para inicializar el estado para que solo se ejecute una vez
    const [storedValue, setStoredValue] = useState(() => {
        // Verifica si 'window' está definido (importante para entornos de renderizado del lado del servidor o Edge Functions)
        if (typeof window === 'undefined') {
            // Si no estamos en un navegador, devuelve el valor inicial
            return initialValue;
        }
        try {
            // Intenta obtener el item de localStorage
            const item = window.localStorage.getItem(key);
            // Si el item existe y no es nulo, intenta parsearlo.
            // Si hay un error al parsear (ej. JSON corrupto), o si el item no existe,
            // o si el parseo resulta en un valor que no es el esperado (ej. null),
            // usa el valor inicial. Esto es crucial para asegurar que siempre haya un array si se espera uno.
            if (item) {
                const parsedItem = JSON.parse(item);
                // Si initialValue es un array, asegura que parsedItem también lo sea
                if (Array.isArray(initialValue) && !Array.isArray(parsedItem)) {
                    console.warn(`LocalStorage item for key "${key}" is not an array, but an array was expected. Returning initialValue.`);
                    return initialValue;
                }
                return parsedItem;
            }
            return initialValue; // Si no hay item, usa el valor inicial
        } catch (error) {
            console.error(`Error reading key "${key}" from localStorage:`, error);
            // En caso de error (ej. navegador bloquea localStorage), devuelve el valor inicial
            return initialValue;
        }
    });

    // useEffect para actualizar localStorage cuando el estado cambia
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Guarda el valor actual en localStorage.
                // Si storedValue es undefined o null, se guardará como "null" o "undefined" string.
                // Para evitar esto, si initialValue es un array y storedValue no lo es,
                // podrías querer guardar un array vacío o el initialValue, pero esto
                // es más complejo y generalmente se maneja mejor en el `useState` de arriba.
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(`Error writing key "${key}" to localStorage:`, error);
                // Esto podría indicar que el espacio de almacenamiento está lleno o un problema de seguridad.
            }
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;