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
 * Obtiene la lista de empleados (GET /empleados/)
 */
export const getEmpleados = async () => {
  try {
    const response = await fetch(URL_BASE); 
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const dataBruta = await response.json();
    const listaDeApi = dataBruta.empleados;
    
    const dataLimpia = listaDeApi.map(traducirAFrontend);
    return dataLimpia;

  } catch (error) {
    console.error("Error en el servicio getEmpleados:", error);
    throw error;
  }
};

/**
 * Crea un nuevo empleado (POST /empleados/nuevo/)
 */
export const createEmpleado = async (empleado) => {
  try {
    const response = await fetch(`${URL_BASE}nuevo/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(traducirABackend(empleado)),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json(); 

  } catch (error) {
    console.error("Error en el servicio createEmpleado:", error);
    throw error;
  }
};


/**
 * Actualiza un empleado existente (PUT /empleados/editar/<dni>/)
 */
export const updateEmpleado = async (dni, empleado) => {
  try {
    const response = await fetch(`${URL_BASE}editar/${dni}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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
 * Elimina un empleado (DELETE /empleados/eliminar/<dni>/)
 */
export const deleteEmpleado = async (dni) => {
  try {
    const response = await fetch(`${URL_BASE}eliminar/${dni}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json(); 

  } catch (error) {
    console.error("Error en el servicio deleteEmpleado:", error);
    throw error;
  }
};


// -----------------------------------------------------------
// ----- 🔴 INICIO DE CAMBIOS: NUEVAS FUNCIONES DE BÚSQUEDA 🔴 -----
// -----------------------------------------------------------

/**
 * Obtiene UN empleado por DNI (GET /empleados/dni/<dni>/)
 * @param {number|string} dni - El DNI a buscar
 */
export const getEmpleadoByDni = async (dni) => {
  try {
    const response = await fetch(`${URL_BASE}dni/${dni}/`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const dataBruta = await response.json();
    
    // ----- INICIO DE LA CORRECCIÓN -----
    // La búsqueda de Nombre (que SÍ funciona) usa "empleados" (plural).
    // Asumimos que DNI también devuelve {"empleados": [{...}]} (una lista con 1 item).
    
    const listaDeApi = dataBruta.empleados; // <-- LEEMOS LA LISTA (plural)
    const empleadoApi = listaDeApi ? listaDeApi[0] : null; // <-- TOMAMOS EL PRIMER ITEM
    // ----- FIN DE LA CORRECCIÓN -----
    
    return traducirAFrontend(empleadoApi); // Traducimos el único objeto

  } catch (error) {
    console.error("Error en el servicio getEmpleadoByDni:", error);
    throw error;
  }
};

/**
 * Obtiene UNA LISTA de empleados por Nombre (GET /empleados/nombre/<nombre>/)
 * @param {string} nombre - El nombre a buscar
 */
export const getEmpleadosByNombre = async (nombre) => {
  try {
    // Codificamos el nombre para que la URL maneje espacios (ej: "Juan Perez")
    const encodedNombre = encodeURIComponent(nombre);
    
    const response = await fetch(`${URL_BASE}nombre/${encodedNombre}/`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const dataBruta = await response.json();
    
    // Asumimos que la API devuelve { "empleados": [...] } (plural)
    const listaDeApi = dataBruta.empleados; 
    
    return listaDeApi.map(traducirAFrontend); // Traducimos la lista

  } catch (error) {
    console.error("Error en el servicio getEmpleadosByNombre:", error);
    throw error;
  }
};
// -----------------------------------------------------------
// ----- 🔴 FIN DE CAMBIOS 🔴 -----
// -----------------------------------------------------------