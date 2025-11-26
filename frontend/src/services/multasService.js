/**
 * services/multasService.js
 * * Servicio para interactuar con el API de Multas.
 * Este servicio está basado en las URLs y Vistas específicas proporcionadas.
 * * Endpoints:
 * 1. POST /alquileres/multas/nuevo/
 * (multa_create)
 * 2. GET /alquileres/multas/{id_alquiler}/
 * (multas_por_alquiler)
 * 3. PUT /alquileres/multas/{id_alquiler}/{id_multa}/
 * (multa_update)
 *
 * NOTA: No existe un endpoint para GET (todas) o DELETE (eliminar).
 */

// Prefijo base que incluye tu app 'alquileres'
const API_PREFIX = "http://127.0.0.1:8000";

/**
 * Función genérica para manejar las respuestas del API.
 * Extrae el JSON y maneja los errores que devuelve el backend.
 */
const handleResponse = async (response) => {
    // Clonamos la respuesta para poder leerla dos veces si falla el JSON
    const responseClone = response.clone();
    
    let data;
    try {
        // Intenta parsear la respuesta como JSON
        data = await response.json();
    } catch (e) {
        // Si falla (ej. error 500 con HTML), lee como texto
        const errorText = await responseClone.text();
        console.error("La respuesta del servidor no es JSON:", errorText);
        throw new Error(`Error ${response.status}: El servidor no devolvió JSON. Respuesta: ${errorText.substring(0, 100)}...`);
    }

    // Si la respuesta no fue 'ok' (ej. 400, 404, 500)
    if (!response.ok) {
        // Tu views.py devuelve los errores en la clave "error"
        const errorMessage = data.error || `Error ${response.status}: Ocurrió un error desconocido.`;
        
        // Si el error es un diccionario (de un Form.errors), lo convertimos a string
        if (typeof errorMessage === 'object') {
            throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error(errorMessage);
    }
    
    // Devuelve los datos si todo fue bien
    return data;
};

// --- Funciones del Servicio (Basadas en tu API) ---

/**
 * 1. Obtener todas las multas DE UN ALQUILER específico.
 * (Corresponde a 'multas_por_alquiler')
 * GET /alquileres/multas/{id_alquiler}/
 *
 * @param {number | string} idAlquiler - El ID del alquiler a consultar.
 */
export const getMultasPorAlquiler = async (idAlquiler) => {
    // Validamos que el ID del alquiler se haya proporcionado
    if (!idAlquiler) {
        throw new Error("Se requiere un ID de Alquiler para consultar las multas.");
    }

    const response = await fetch(`${API_PREFIX}/multas/${idAlquiler}/`);
    const data = await handleResponse(response);
    
    // Tu view devuelve {"multas": lista, ...}, extraemos solo la lista.
    return data.multas; 
};

/**
 * 2. Crear una nueva multa para un alquiler.
 * (Corresponde a 'multa_create')
 * POST /alquileres/multas/nuevo/
 *
 * @param {object} multaData - Debe contener { alquiler, motivo, monto }
 * (Donde 'alquiler' es el ID del alquiler)
 */
export const createMulta = async (multaData) => {
    const response = await fetch(`${API_PREFIX}/multas/nuevo/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // El body debe coincidir con lo que espera 'multa_create'
        body: JSON.stringify(multaData),
    });
    // Devuelve { message, id_multa }
    return handleResponse(response); 
};

/**
 * 3. Actualizar una multa específica.
 * (Corresponde a 'multa_update')
 * PUT /alquileres/multas/{id_alquiler}/{id_multa}/
 *
 * @param {number | string} idAlquiler - ID del alquiler (requerido por la URL)
 * @param {number | string} idMulta - ID de la multa a modificar
 * @param {object} multaData - { motivo: "...", monto: ... }
 */
export const updateMulta = async (idAlquiler, idMulta, multaData) => {
    const response = await fetch(`${API_PREFIX}/multas/${idAlquiler}/${idMulta}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        // El body debe tener 'motivo' o 'monto'
        body: JSON.stringify(multaData),
    });
    // Devuelve { message, id_multa }
    return handleResponse(response);
};

export const getMultaEspecifica = async (idAlquiler, idMulta) => {
    if (!idAlquiler || !idMulta) {
        throw new Error("Se requiere ID de alquiler y de multa.");
    }

    const response = await fetch(`${API_PREFIX}/multas/${idAlquiler}/${idMulta}/`);
    return handleResponse(response); // el backend devolverá solo UNA multa
};
