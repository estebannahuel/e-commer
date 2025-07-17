// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    // Usa una función para inicializar el estado para que solo se ejecute una vez
    const [storedValue, setStoredValue] = useState(() => {
        // Verifica si 'window' está definido (importante para entornos de renderizado del lado del servidor)
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            
            // SIEMPRE maneja 'null' (cuando el item no existe) antes de intentar parsear.
            // Si el item es null, simplemente devuelve el initialValue.
            if (item === null) {
                return initialValue;
            }

            // Si el item NO es null, intenta parsearlo.
            try {
                const parsedItem = JSON.parse(item);
                // Si initialValue es un array y parsedItem no lo es, devuelve initialValue para consistencia.
                if (Array.isArray(initialValue) && !Array.isArray(parsedItem)) {
                     console.warn(`LocalStorage item for key "${key}" is not an array, but an array was expected. Returning initialValue.`);
                     return initialValue;
                }
                return parsedItem;
            } catch (parseError) {
                // Si el JSON es inválido o corrupto, loguea el error y devuelve el initialValue.
                console.error(`Error parsing localStorage item for key "${key}":`, parseError);
                return initialValue;
            }
        } catch (error) {
            // Esto captura errores si localStorage no es accesible (ej. en ciertos modos de navegador o si el espacio está lleno)
            console.error(`Error accessing localStorage for key "${key}":`, error);
            // En caso de cualquier error durante el acceso a localStorage, devuelve el valor inicial.
            return initialValue;
        }
    });

    // useEffect para actualizar localStorage cuando el estado cambia
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Guarda el valor actual en localStorage.
                // JSON.stringify manejará 'null' y 'undefined' convirtiéndolos a sus cadenas literales "null" y "undefined",
                // que luego son manejadas por la lógica de inicialización robusta de useState.
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(`Error writing key "${key}" to localStorage:`, error);
            }
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

export default useLocalStorage;