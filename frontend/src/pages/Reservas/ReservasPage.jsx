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

export default function ReservasPage() {
    const [vista, setVista] = useState("lista");
    const [reservas, setReservas] = useState([]); 
    const [filtroID, setFiltroID] = useState("");
    
    // ----- INICIO CAMBIO: Se elimina 'pagina' y 'setPagina' -----
    // const [pagina, setPagina] = useState(1); // <-- LÍNEA BORRADA
    // ----- FIN CAMBIO -----
    
    const [reservaEditando, setReservaEditando] = useState(null);
    const [volverA, setVolverA] = useState("menu");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // <-- 'setError' se usa, 'error' lo usaremos ahora

    // fetchReservas ahora es la función "Limpiar"
    const fetchReservas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getReservas();
            setReservas(data);
            setFiltroID(""); 
        } catch (err) {
            setError(err.message);
            console.error("Error al cargar reservas:", err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleCancelar = async (reserva) => {
        if (window.confirm(`¿Estás seguro de que deseas CANCELAR la reserva ${reserva.IdReserva}?`)) {
            setLoading(true); 
            setError(null);
            try {
                const reservaActualizada = await cancelarReserva(reserva.IdReserva);
                setReservas(prev => prev.map(v => 
                    v.IdReserva === reservaActualizada.IdReserva ? reservaActualizada : v
                ));
            } catch (err) {
                setError(err.message);
                console.error("Error al cancelar reserva:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Funciones de BÚSQUEDA DE BACKEND
    const handleLimpiar = () => {
        fetchReservas();
    };

    const handleBuscarPorId = async () => {
        setLoading(true);
        setError(null);
        if (!filtroID) {
            setError("Debe ingresar un ID de reserva para buscar.");
            setLoading(false);
            return;
        }
        try {
            const reservaEncontrada = await getReservaById(filtroID);
            setReservas([reservaEncontrada]);
        } catch (err) {
            setError(err.message);
            setReservas([]); 
            console.error("Error al buscar por ID:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarDelDia = async () => {
        setLoading(true);
        setError(null);
        try {
            const reservasDelDia = await getReservasHoy();
            setReservas(reservasDelDia); 
            setFiltroID(""); 
        } catch (err) {
            setError(err.message);
            console.error("Error al buscar reservas del día:", err);
        } finally {
            setLoading(false);
        }
    };

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
            await fetchReservas(); 
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

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de reservas</h2>
            <p className="page-subtitle">
                Controlá el estado y los datos de cada reserva.
            </p>

            {/* ----- INICIO CAMBIO: Agregamos el JSX de Error y Loading ----- */}
            {/* 1. Mensaje de Error Global */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}

            {/* 2. Indicador de Carga Global */}
            {loading && (
                <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando datos...</p>
                </div>
            )}
            {/* ----- FIN CAMBIO ----- */}


            {/* VISTA LISTA (Visible solo si NO está cargando) */}
            {vista === "lista" && !loading && (
                <div className="fade-in">
                <ReservasList
                    Reservas={reservas}
                    Consultar={handleConsultar}
                    Modificar={handleModificar}
                    Cancelar={handleCancelar}
                    Agregar={() => handleAgregar("lista")}
                    
                    // ----- INICIO CAMBIO: Ya no pasamos 'Pagina' -----
                    Pagina={1} // Pasamos '1' fijo
                    // ----- FIN CAMBIO -----
                    
                    RegistrosTotal={reservas.length}
                    Paginas={[1]} 
                    Volver={() => setVista("menu")}

                    // Props de Búsqueda Backend
                    FiltroID={filtroID}
                    setFiltroID={setFiltroID}
                    BuscarPorID={handleBuscarPorId} 
                    BuscarDelDia={handleBuscarDelDia} 
                    Limpiar={handleLimpiar}
                />
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