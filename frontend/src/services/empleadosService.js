// src/services/empleadosService.js

// --- Definimos la URL base de tu API en un solo lugar ---
const URL_BASE = 'http://localhost:8000/empleados/';


/**
 * Traduce los datos del backend {dni, nombre, apellido}
 * al formato del frontend {DNI, Nombre, Apellido}
 */
const traducirAFrontend = (empleado) => ({
  DNI: empleado.dni,
  Nombre: empleado.nombre,
  Apellido: empleado.apellido
});

/**
 * Traduce los datos del frontend {DNI, Nombre, Apellido}
 * al formato del backend {dni, nombre, apellido}
 */
const traducirABackend = (empleado) => ({
  dni: empleado.DNI,
  nombre: empleado.Nombre,
  apellido: empleado.Apellido
});


/**
 * Obtiene la lista de empleados (GET)
 */
export const getEmpleados = async () => {
  try {
    // Llama a: http://localhost:8000/empleados/
    const response = await fetch(URL_BASE); 
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const dataBruta = await response.json();
    const listaDeApi = dataBruta.empleados;
    
    // Traducimos los datos antes de devolverlos
    const dataLimpia = listaDeApi.map(traducirAFrontend);
    return dataLimpia;

  } catch (error) {
    console.error("Error en el servicio getEmpleados:", error);
    throw error;
  }
};

// ----------------------------------------------------
// ----- 🔴 NUEVAS FUNCIONES DE API AÑADIDAS 🔴 -----
// ----------------------------------------------------

/**
 * Crea un nuevo empleado (POST)
 * @param {object} empleado - El empleado en formato frontend {DNI, Nombre, Apellido}
 */
export const createEmpleado = async (empleado) => {
  try {
    // Llama a: http://localhost:8000/empleados/nuevo/
    const response = await fetch(`${URL_BASE}nuevo/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Traducimos el empleado al formato del backend antes de enviarlo
      body: JSON.stringify(traducirABackend(empleado)),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json(); // Devuelve la respuesta del backend (ej: {message: "OK"})

  } catch (error) {
    console.error("Error en el servicio createEmpleado:", error);
    throw error;
  }
};


/**
 * Actualiza un empleado existente (PUT)
 * @param {number|string} dni - El DNI del empleado a editar
 * @param {object} empleado - El empleado en formato frontend {DNI, Nombre, Apellido}
 */
export const updateEmpleado = async (dni, empleado) => {
  try {
    // Llama a: http://localhost:8000/empleados/editar/12345678/
    const response = await fetch(`${URL_BASE}editar/${dni}/`, {
      method: 'PUT', // O 'PATCH' si tu backend lo prefiere
      headers: {
        'Content-Type': 'application/json',
      },
      // Traducimos el empleado al formato del backend
      body: JSON.stringify(traducirABackend(empleado)),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error("Error en el servicio updateEmpleado:", error);
    throw error;
  }
};


/**
 * Elimina un empleado (DELETE)
 * @param {number|string} dni - El DNI del empleado a eliminar
 */
export const deleteEmpleado = async (dni) => {
  try {
    // Llama a: http://localhost:8000/empleados/eliminar/12345678/
    const response = await fetch(`${URL_BASE}eliminar/${dni}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json(); // Devuelve {message: "Eliminado"}

  } catch (error) {
    console.error("Error en el servicio deleteEmpleado:", error);
    throw error;
  }
};