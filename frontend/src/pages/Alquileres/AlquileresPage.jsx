import React, { useState, useEffect, useCallback } from "react";
import AlquileresList from "./AlquileresList";
import AlquileresForm from "./AlquileresForm";
import "../../styles/PageLayout.css";
import { obtenerAlquileres, obtenerAlquiler, crearAlquiler, finalizarAlquiler } from "../../services/alquileresService";

export default function AlquileresPage() {
    const [vista, setVista] = useState("lista");

    const [todosLosAlquileres, setTodosLosAlquileres] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [alquilerSeleccionado, setAlquilerSeleccionado] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [RegistrosTotal, setRegistrosTotal] = useState(0); 
    const [Paginas, setPaginas] = useState([]);

    const [filtroPatente, setFiltroPatente] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    useEffect(() => {
        cargarAlquileres(); 
    }, []);

    const cargarAlquileres = useCallback(async (paginaActual = 1) => { 
        try {
            const data = await obtenerAlquileres(paginaActual, 5, filtroPatente); 

            let listaFiltrada = data.alquileres;
            if (filtroEstado) {
                const hoy = new Date();
                listaFiltrada = listaFiltrada.filter(a => {
                    const fechaFin = a.fecha_fin ? new Date(a.fecha_fin) : null;
                    if (filtroEstado === "Activo") return !fechaFin || fechaFin >= hoy;
                    if (filtroEstado === "Finalizado") return fechaFin && fechaFin < hoy;
                    return true;
                });
            }

            setAlquileres(listaFiltrada);
            setRegistrosTotal(data.total);
            setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
            setPagina(data.page);

        } catch (err) {
            console.error("Error cargando alquileres:", err);
            alert("No se pudieron cargar los alquileres.");
        }
    }, [filtroPatente, filtroEstado]); 

    const handleBuscar = async (numPagina = 1) => { // ← CAMBIO: mantiene misma página o actualiza
        setPagina(numPagina);
        await cargarAlquileres(numPagina);
    };

    const handleAgregar = () => {
        setAlquilerSeleccionado(null);
        setVista("form");
    };

    const handleModificar = async (alquiler) => { // ← CAMBIO: async, trae del backend
        try {
            const data = await obtenerAlquiler(alquiler.id);
            setAlquilerSeleccionado(data.alquiler);
            setVista("form");
        } catch (err) {
            console.error(err);
            alert("No se pudo cargar el alquiler.");
        }
    };

    const handleGuardar = async (alquilerForm) => {
        try {
            await crearAlquiler(alquilerForm);
            await cargarAlquileres(pagina);
            setVista("lista");
        } catch (err) {
            console.error("Error guardando alquiler:", err);
            alert("No se pudo guardar el alquiler.");
        }
    };


    const handleFinalizar = async (alquiler) => {
        if (!window.confirm("¿Seguro que deseas finalizar este alquiler?")) return;

        try {
            await finalizarAlquiler(alquiler.id);
            alert("Alquiler finalizado correctamente");
            await cargarAlquileres(pagina);
        } catch (err) {
            console.error(err);
            alert(err.error || "Error al finalizar el alquiler");
        }
    };

    const handleVolverALista = () => {
        setVista("lista");
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Alquileres</h2>
            <p className="page-subtitle">
                Controlá de principio a fin cada alquiler para mantener un flujo ordenado.
            </p>

            {vista === "lista" && (
                <div className="fade-in">
                    <AlquileresList
                        Alquileres={alquileres}
                        Finalizar={handleFinalizar}
                        Agregar={handleAgregar}
                        Pagina={pagina}
                        RegistrosTotal={RegistrosTotal}
                        Paginas={Paginas}
                        Buscar={handleBuscar}
                        FiltroPatente={filtroPatente}
                        setFiltroPatente={setFiltroPatente}
                        FiltroEstado={filtroEstado}
                        setFiltroEstado={setFiltroEstado}
                    />

                    {/* <div className="text-center mt-4 mb-3">
                        <button className="btn btn-secondary px-4" onClick={() => window.location.href = "/"}>
                            <i className="fa-solid fa-arrow-left me-2"></i> Volver al Inicio
                        </button>
                    </div> */}
                </div>
            )}

            {vista === "form" && (
                <div className="fade-in">
                    <AlquileresForm
                        Alquiler={alquilerSeleccionado}
                        Guardar={handleGuardar}
                        Cancelar={handleVolverALista}
                    />

                    {/* <div className="text-center mt-4 mb-3">
                        <button className="btn btn-secondary px-4" onClick={handleVolverALista}>
                            <i className="fa-solid fa-arrow-left me-2"></i>
                            Volver al listado
                        </button>
                    </div> */}
                </div>
            )}
        </div>
    );
}