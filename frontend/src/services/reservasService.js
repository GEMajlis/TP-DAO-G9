// (Ajusta si tenés prefijo 'api/' o un puerto diferente)
const API_URL = "http://127.0.0.1:8000"; 

// ----- 1. LOS TRADUCTORES (API <-> React) -----
// (Estos no cambian, la forma de los datos es la misma)

const mapApiToReact = (reservaApi) => {
    if (!reservaApi) return null;
    return {
        IdReserva: reservaApi.id,
        DNICliente: reservaApi.cliente_dni,
        ClienteNombre: reservaApi.cliente_nombre,
        Patente: reservaApi.vehiculo_patente,
        VehiculoModelo: reservaApi.vehiculo_modelo,
        FechaReserva: reservaApi.fecha_reserva,
        FechaInicio: reservaApi.fecha_inicio,
        FechaFin: reservaApi.fecha_fin,
        Estado: reservaApi.estado,
    };
};

const mapReactToApi = (reservaReact) => {
    if (!reservaReact) return null;

    // ----- INICIO DEL CAMBIO -----
    // Hacemos que el servicio "escuche" las claves que el formulario SÍ envía
    return {
        cliente: reservaReact.DNICLiente,  // <-- Leemos DNICLiente
        vehiculo: reservaReact.Patente,  // <-- Leemos Patente
        fecha_inicio: reservaReact.FechaInicio,
        fecha_fin: reservaReact.FechaFin,
    };
    // ----- FIN DEL CAMBIO -----
};

// ----- 2. HELPER GENÉRICO (Manejo de Errores) -----
// (Este no cambia)

const apiFetch = async (endpoint, options = {}) => {
    if (options.body) {
        options.headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
    }
    
    const url = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const response = await fetch(url, options);

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


// ----- 3. FUNCIONES DEL CRUD (Ajustadas a tu urls.py) -----

/**
 * (GET /reservas/)
 * path('', views.reserva_list, ...)
 */
export const getReservas = async () => {
    const data = await apiFetch("/reservas/"); // Esta se mantiene igual
    const reservasApi = data.reservas || [];
    return reservasApi.map(mapApiToReact);
};

/**
 * (GET /reservas/<id>/)
 * path('<int:id>/', views.reserva_detail, ...)
 */
export const getReservaById = async (id) => {
    const data = await apiFetch(`/reservas/${id}/`); // Esta se mantiene igual
    return mapApiToReact(data.reserva);
};

/**
 * (POST /reservas/nuevo/)
 * path('nuevo/', views.reserva_create, ...)
 */
export const createReserva = async (reservaDataReact) => {
    const reservaDataApi = mapReactToApi(reservaDataReact);
    
    console.log("Enviando a Django (POST /reservas/nuevo/):", reservaDataApi);
    
    // CAMBIO DE URL: de /reservas/ a /reservas/nuevo/
    const data = await apiFetch("/reservas/nuevo/", {
        method: 'POST',
        body: JSON.stringify(reservaDataApi),
    });
    
    return mapApiToReact(data.reserva); 
};

/**
 * (PUT /reservas/<id>/editar/)
 * path('<int:id>/editar/', views.reserva_update, ...)
 */
export const updateReserva = async (id, reservaDataReact) => {
    const reservaDataApi = mapReactToApi(reservaDataReact);
    
    console.log(`Enviando a Django (PUT /reservas/${id}/editar/):`, reservaDataApi);

    // CAMBIO DE URL: de /reservas/<id>/ a /reservas/<id>/editar/
    const data = await apiFetch(`/reservas/${id}/editar/`, {
        method: 'PUT',
        body: JSON.stringify(reservaDataApi),
    });
    
    return mapApiToReact(data.reserva);
};

/**
 * (DELETE /reservas/<id>/eliminar/)
 * path('<int:id>/eliminar/', views.reserva_delete, ...)
 */
export const deleteReserva = async (id) => {
    // CAMBIO DE URL: de /reservas/<id>/ a /reservas/<id>/eliminar/
    return apiFetch(`/reservas/${id}/eliminar/`, {
        method: 'DELETE',
    });
};


// ----- 4. ACCIONES ESPECIALES (Ajustadas a tu urls.py) -----

/**
 * (POST /reservas/<id>/confirmar/)
 * path('<int:id>/confirmar/', ...)
 */
export const confirmarReserva = async (id) => {
    const data = await apiFetch(`/reservas/${id}/confirmar/`, { // Esta se mantiene
        method: 'POST',
    });
    return mapApiToReact(data.reserva);
};

/**
 * (POST /reservas/<id>/cancelar/)
 * path('<int:id>/cancelar/', ...)
 */
export const cancelarReserva = async (id) => {
    const data = await apiFetch(`/reservas/${id}/cancelar/`, { // Esta se mantiene
        method: 'POST',
    });
    return mapApiToReact(data.reserva);
};

/**
 * (POST /reservas/<id>/convertir-a-alquiler/)
 * path('<int:id>/convertir-a-alquiler/', ...)
 */
export const convertirReservaAAlquiler = async (id, empleadoDni) => {
    const body = { empleado_dni: empleadoDni };
    
    // CAMBIO DE URL: (guion bajo a guion medio, para coincidir con tu urls.py)
    const data = await apiFetch(`/reservas/${id}/convertir-a-alquiler/`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    
    return data.alquiler; 
};

/**
 * (GET /reservas/del-dia/)
 * path('del-dia/', views.reservas_del_dia, ...)
 */
export const getReservasHoy = async () => {
    // CAMBIO DE URL: de /reservas/hoy/ a /reservas/del-dia/
    const data = await apiFetch("/reservas/del-dia/"); 
    const reservasApi = data.reservas || [];
    return reservasApi.map(mapApiToReact); 
};