// ----- REEMPLAZÁ TODO TU src/services/clientesService.js CON ESTO -----

const API_URL = "http://127.0.0.1:8000"; // (Ajusta si tenés prefijo 'api/')


// ----- 🔴 1. LOS TRADUCTORES (Igual que en Empleados) 🔴 -----
// (API -> React)
const mapApiToReact = (cliente) => {
    if (!cliente) return null; 
    return {
        DNI: cliente.dni,
        Nombre: cliente.nombre,
        Apellido: cliente.apellido,
        Telefono: cliente.telefono
    };
};

// (React -> API)
const mapReactToApi = (cliente) => {
    if (!cliente) return null;
    return {
        dni: cliente.DNI,
        nombre: cliente.Nombre,
        apellido: cliente.Apellido,
        telefono: cliente.Telefono
    };
};
// ----- 🔴 FIN TRADUCTORES 🔴 -----


// (Helper genérico 'apiFetch' con el manejo de errores mejorado)
const apiFetch = async (endpoint, options = {}) => {
    if (options.body) {
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
    }
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage;
        if (errorData.error) {
            if (typeof errorData.error === 'object') {
                const firstErrorField = Object.keys(errorData.error)[0];
                const firstErrorMessage = errorData.error[firstErrorField][0];
                errorMessage = `${firstErrorField}: ${firstErrorMessage}`;
            } else {
                errorMessage = errorData.error;
            }
        } else {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    if (response.status === 204) return null; 
    return response.json();
};


// --- FUNCIONES DEL CRUD ---

export const getClientes = async () => {
    const data = await apiFetch("/clientes/"); 
    const clientesApi = data.clientes || []; 
    // ----- 🔴 TRADUCCIÓN (GET) 🔴 -----
    return clientesApi.map(mapApiToReact);
};

export const createCliente = async (clienteDataReact) => {
    // ----- 🔴 TRADUCCIÓN (POST) - ¡IGUAL QUE EN EMPLEADOS! 🔴 -----
    const clienteDataApi = mapReactToApi(clienteDataReact);
    
    // ----- 🔴 PRUEBA DE FUEGO 🔴 -----
    // (Esto te dirá en la consola si el traductor funcionó)
    console.log("Enviando a Django (POST):", clienteDataApi); 
    
    return apiFetch("/clientes/nuevo/", {
        method: 'POST',
        body: JSON.stringify(clienteDataApi), // Enviamos el objeto traducido
    });
};

export const updateCliente = async (dni, clienteDataReact) => {
    // ----- 🔴 TRADUCCIÓN (PUT) - ¡IGUAL QUE EN EMPLEADOS! 🔴 -----
    const clienteDataApi = mapReactToApi(clienteDataReact);

    console.log("Enviando a Django (PUT):", clienteDataApi);

    return apiFetch(`/clientes/editar/${dni}/`, {
        method: 'PUT',
        body: JSON.stringify(clienteDataApi), // Enviamos el objeto traducido
    });
};

export const deleteCliente = async (dni) => {
    return apiFetch(`/clientes/eliminar/${dni}/`, {
        method: 'DELETE',
    });
};


// --- FUNCIONES DE BÚSQUEDA ---
export const getClienteByDni = async (dni) => {
    const data = await apiFetch(`/clientes/dni/${dni}/`);
    const clienteApi = data.clientes ? data.clientes[0] : null;
    return mapApiToReact(clienteApi); 
};

export const getClientesByNombre = async (nombre) => {
    const encodedNombre = encodeURIComponent(nombre);
    const data = await apiFetch(`/clientes/nombre/${encodedNombre}/`);
    const clientesApi = data.clientes || [];
    return clientesApi.map(mapApiToReact);
};