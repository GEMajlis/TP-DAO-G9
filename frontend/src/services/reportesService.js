// services/reportesService.js

// 🔴 CORRECCIÓN: Se elimina el prefijo "/api" ya que el backend lo sirve directamente desde la raíz.
const API_BASE_URL = "http://127.0.0.1:8000"; 

/**
 * Función genérica para manejar la respuesta de la API.
 * @param {Response} response - Objeto de respuesta Fetch.
 * @returns {Promise<Object>} - El JSON de la respuesta o lanza un error descriptivo.
 */
const handleResponse = async (response) => {
    // 🔴 SOLUCIÓN: Clonamos la respuesta. Esto permite leer el body dos veces
    // (una como JSON, y otra como texto si la primera falla).
    const responseClone = response.clone(); 
    
    // Primero intentamos leer la respuesta como JSON
    let data;
    try {
        data = await response.json();
    } catch (e) {
        // Si falla la lectura como JSON (es HTML o está vacío), usamos la copia
        // para leer el error como texto y dar un mensaje descriptivo.
        const textError = await responseClone.text(); 
        const firstLine = textError.substring(0, 100);
        throw new Error(`El servidor no devolvió JSON. El mensaje de error fue: ${firstLine}... (Código HTTP: ${response.status})`);
    }

    if (!response.ok) {
        // Si el código de respuesta es 4xx o 5xx, lanzamos el error del backend
        const errorMessage = data.error || `Error ${response.status}: Ha ocurrido un problema en el servidor.`;
        throw new Error(errorMessage);
    }
    
    return data;
};

/**
 * REPORTE 1: Vehículos con más alquileres.
 * GET /reporte/vehiculos/
 * @returns {Promise<Array<Object>>} Lista de vehículos ordenada por cantidad de alquileres.
 */
export const getReporteVehiculosMasAlquileres = async () => {
    // La URL ahora es "/reporte/vehiculos/"
    const response = await fetch(`${API_BASE_URL}/reporte/vehiculos/`); 
    const data = await handleResponse(response);
    return data.reporte; // Devolvemos solo el array de reporte
};

/**
 * REPORTE 2: Facturación mensual.
 * GET /reporte/facturacion/
 * @returns {Promise<Array<Object>>} Lista de facturación por mes.
 */
export const getReporteFacturacionMensual = async () => {
    // La URL ahora es "/reporte/facturacion/"
    const response = await fetch(`${API_BASE_URL}/reporte/facturacion/`);
    const data = await handleResponse(response);
    return data.reporte_facturacion; // Devolvemos solo el array de reporte
};

/**
 * REPORTE 3: Alquileres por período de fechas.
 * GET /reporte/alquileres/<fecha_inicio>/<fecha_fin>/
 * @param {string} fechaInicio - Fecha de inicio (YYYY-MM-DD).
 * @param {string} fechaFin - Fecha de fin (YYYY-MM-DD).
 * @returns {Promise<Array<Object>>} Lista de alquileres dentro del período.
 */
export const getReporteAlquileresPorPeriodo = async (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) {
        throw new Error("Debe especificar una fecha de inicio y una fecha de fin.");
    }

    // La URL ahora es "/reporte/alquileres/<f1>/<f2>/"
    const url = `${API_BASE_URL}/reporte/alquileres/${fechaInicio}/${fechaFin}/`;
    const response = await fetch(url);
    const data = await handleResponse(response);
    return data.alquileres; // Devolvemos solo el array de alquileres
};