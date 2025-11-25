import React, { useState, useEffect } from "react";
import ReservasList from "./ReservasList";
import ReservasForm from "./ReservasForm";
import { 
    getReservas, 
    createReserva, 
    updateReserva, 
    cancelarReserva,
    getReservaById,
    getReservasHoy
} from "../../services/reservasService";
import "../../styles/PageLayout.css";

// ----- 🔴 1. CONSTANTE DE PAGINACIÓN 🔴 -----
const REGISTROS_POR_PAGINA = 10;
// ------------------------------------------

export default function ReservasPage() {
    const [vista, setVista] = useState("lista");
    
    // ----- 🔴 2. ESTADOS DE LISTA SEPARADOS 🔴 -----
    // 'reservas' ahora es 'reservasMostradas' (la "rebanada")
    const [reservasMostradas, setReservasMostradas] = useState([]); 
    // NUEVO: 'todosLasReservas' (la lista "master" completa)
    const [todosLasReservas, setTodosLasReservas] = useState([]);
    // -------------------------------------------

    const [filtroID, setFiltroID] = useState("");
    
    // ----- 🔴 3. ESTADOS DE PAGINACIÓN 🔴 -----
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasTotales, setPaginasTotales] = useState([]);
    // ---------------------------------------
    
    const [reservaEditando, setReservaEditando] = useState(null);
    const [volverA, setVolverA] = useState("menu");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    
    // ----- 🔴 4. HELPER PARA PAGINAR LOCALMENTE 🔴 -----
    // Esta función "rebana" la lista master y actualiza los estados
    const actualizarPaginacion = (listaCompleta, numPagina) => {
        const paginaNum = parseInt(numPagina);
        
        // Calcular total de páginas
        const totalPag = Math.ceil(listaCompleta.length / REGISTROS_POR_PAGINA);
        // Crear el array [1, 2, ..., N] (aseguramos al menos 1 página)
        const arrPaginas = Array.from({ length: totalPag || 1 }, (_, i) => i + 1);
        
        // Calcular la "rebanada"
        const inicio = (paginaNum - 1) * REGISTROS_POR_PAGINA;
        const fin = paginaNum * REGISTROS_POR_PAGINA;
        
        // Actualizar todos los estados
        setPaginasTotales(arrPaginas);
        setPaginaActual(paginaNum);
        setReservasMostradas(listaCompleta.slice(inicio, fin));
    };
    // --------------------------------------------------


    // ----- 🔴 5. 'fetchReservas' ES AHORA LA CARGA INICIAL 🔴 -----
    // (La "carga lenta" que descarga todo)
    const fetchReservas = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API y trae TODAS las reservas
            const data = await getReservas();
            
            // 2. Guarda la "copia master" completa
            setTodosLasReservas(data);
            
            // 3. Llama al helper para mostrar la Página 1
            actualizarPaginacion(data, 1);
            
            setFiltroID(""); 
        } catch (err) {
            setError(err.message);
            console.error("Error al cargar reservas:", err);
            setTodosLasReservas([]);
            setReservasMostradas([]);
        } finally {
            setLoading(false);
        }
    };
    // ---------------------------------------------------------

    // useEffect se queda igual, llama a la carga inicial 1 vez
    useEffect(() => {
        fetchReservas();
    }, []); 

    
    const handleAgregar = (origen) => {
        setReservaEditando(null);
        setVolverA(origen); 
        setVista("form");
    };

    const handleModificar = (reserva) => {
        setReservaEditando(reserva);
        setVolverA("lista"); 
        setVista("form");
    };

    const handleConsultar = (reserva) => {
        alert(`Consultando: ${reserva.IdReserva}`); 
    };

    // ----- 🔴 6. 'handleCancelar' DEBE RECARGAR TODO 🔴 -----
    // (Para que la "copia master" se actualice)
    const handleCancelar = async (reserva) => {
        if (window.confirm(`¿Estás seguro de que deseas CANCELAR la reserva ${reserva.IdReserva}?`)) {
            setLoading(true); 
            setError(null);
            try {
                // 1. Llama a la API para cancelar
                await cancelarReserva(reserva.IdReserva);
                
                // 2. RECARGA la lista master (igual que handleGuardar)
                // Esto asegura que 'todosLasReservas' esté fresco.
                await fetchReservas();

            } catch (err) {
                setError(err.message);
                console.error("Error al cancelar reserva:", err);
                setLoading(false); // Detener loading si hay error
            }
            // fetchReservas() ya apaga el loading si tiene éxito
        }
    };
    // ----------------------------------------------------

    // ----- 🔴 7. 'handleLimpiar' AHORA ES LOCAL (RÁPIDO) 🔴 -----
    // (Restaura la "copia master" SIN llamar a la API)
    const handleLimpiar = () => {
        setError(null);
        setFiltroID("");
        // 1. Llama al helper para restaurar la Página 1 de la lista master
        actualizarPaginacion(todosLasReservas, 1);
    };
    // -------------------------------------------------------

    // ----- 🔴 8. BÚSQUEDA BACKEND (SOBREESCRIBE LA LISTA) 🔴 -----
    const handleBuscarPorId = async () => {
        setLoading(true);
        setError(null);
        if (!filtroID) {
            setError("Debe ingresar un ID de reserva para buscar.");
            setLoading(false);
            return;
        }
        try {
            // 1. Llama a la API (rápido)
            const reservaEncontrada = await getReservaById(filtroID);
            
            // 2. REEMPLAZA la lista mostrada
            setReservasMostradas([reservaEncontrada]);
            
            // 3. Fija el paginador a "Página 1 de 1"
            setPaginasTotales([1]);
            setPaginaActual(1);

        } catch (err) {
            setError(err.message);
            setReservasMostradas([]);
            setPaginasTotales([1]); // Paginador 1 de 1 incluso si hay error
            setPaginaActual(1);
            console.error("Error al buscar por ID:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarDelDia = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API (rápido)
            const reservasDelDia = await getReservasHoy();
            
            // 2. REEMPLAZA la lista mostrada
            setReservasMostradas(reservasDelDia);
            setFiltroID(""); 

            // 3. Fija el paginador (puede ser 1 o más páginas)
            // Usamos la misma lógica de paginado local para este resultado
            actualizarPaginacion(reservasDelDia, 1);

            // IMPORTANTE: Al buscar del día, la "copia master" no se toca.
            // Si el usuario "Limpia", vuelve a la lista completa.
            
        } catch (err) {
            setError(err.message);
            setReservasMostradas([]);
            setPaginasTotales([1]);
            setPaginaActual(1);
            console.error("Error al buscar reservas del día:", err);
        } finally {
            setLoading(false);
        }
    };
    // ---------------------------------------------------------

    // handleGuardar se queda igual (¡ya llamaba a fetchReservas!)
    const handleGuardar = async (reservaForm) => {
        setLoading(true);
        setError(null);
        try {
            if (reservaForm.IdReserva) { 
                await updateReserva(reservaForm.IdReserva, reservaForm);
            } else { 
                await createReserva(reservaForm);
            }
            setFiltroID("");
            setVista("lista");
            await fetchReservas(); // <-- Perfecto. Recarga la "copia master"
        } catch (err) {
            setError(err.message);
            console.error("Error al guardar reserva:", err);
            setLoading(false);
        }
    };

    const handleVolverDesdeForm = () => {
        setError(null); 
        setVista(volverA);
    };

    // ----- 🔴 9. NUEVA FUNCIÓN PARA EL PAGINADOR LOCAL 🔴 -----
    const handleCambiarPagina = (numPagina) => {
        const paginaNum = parseInt(numPagina);
        
        // Simplemente llama al helper para "rebanar" la lista master
        actualizarPaginacion(todosLasReservas, paginaNum);
    };
    // -----------------------------------------------------

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de reservas</h2>
            <p className="page-subtitle">
                Controlá el estado y los datos de cada reserva.
            </p>

            {/* (El JSX de Error y Loading se queda igual) */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}
            {loading && (
                <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando datos...</p>
                </div>
            )}


            {/* VISTA LISTA */}
            {vista === "lista" && !loading && (
                <div className="fade-in">

                {/* ----- 🔴 10. PASAMOS LAS NUEVAS PROPS AL LISTADO 🔴 ----- */}
                <ReservasList
                    // La lista "rebanada"
                    Reservas={reservasMostradas}
                    
                    Consultar={handleConsultar}
                    Modificar={handleModificar}
                    Cancelar={handleCancelar}
                    Agregar={() => handleAgregar("lista")}
                    
                    // El total REAL de la "copia master"
                    RegistrosTotal={todosLasReservas.length} 
                    
                    // Los estados de paginación
                    Pagina={paginaActual} 
                    Paginas={paginasTotales} 
                    
                    // La NUEVA función para cambiar de página
                    CambiarPagina={handleCambiarPagina}
                    
                    Volver={() => setVista("menu")}

                    // Props de Búsqueda Backend (se quedan igual)
                    FiltroID={filtroID}
                    setFiltroID={setFiltroID}
                    BuscarPorID={handleBuscarPorId} 
                    BuscarDelDia={handleBuscarDelDia} 
                    Limpiar={handleLimpiar}
                />
                {/* --------------------------------------------------- */}

                </div>
            )}

            {/* VISTA FORMULARIO (Sin cambios) */}
            {vista === "form" && (
                <div className="fade-in">
                <ReservasForm
                    Reserva={reservaEditando} 
                    Guardar={handleGuardar}
                    Cancelar={handleVolverDesdeForm}
                />
                
                <div className="text-center mt-4 mb-3">
                    <button 
                        className="btn btn-secondary px-4" 
                        onClick={handleVolverDesdeForm}
                        disabled={loading} 
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
                    </button>
                </div>
                </div>
            )}
        </div>
    );
}