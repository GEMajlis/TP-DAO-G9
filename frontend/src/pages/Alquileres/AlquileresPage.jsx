import React, { useState, useEffect } from "react";
import AlquileresList from "./AlquileresList";
import AlquileresForm from "./AlquileresForm";
import AlquileresDetail from "./AlquileresDetail";
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

    const cargarAlquileres = async ( numPagina = 1, pageSize = 5, aplicarFiltros = true) => {
        try {
            const filtroPatenteActual = aplicarFiltros ? filtroPatente : "";
            const filtroEstadoActual = aplicarFiltros ? filtroEstado : "";

            const data = await obtenerAlquileres(
                numPagina,
                pageSize,
                filtroPatenteActual,
                filtroEstadoActual
            );

            setAlquileres(data.alquileres);
            if (!aplicarFiltros) setTodosLosAlquileres(data.alquileres);

            setRegistrosTotal(data.total);
            setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
            setPagina(data.page);
        } catch (err) {
            console.error("Error cargando alquileres:", err);
            alert("No se pudieron cargar los alquileres.");
        }
    };

    useEffect(() => {
        cargarAlquileres(1, 5, false);
    }, []);

    useEffect(() => {
        cargarAlquileres(1);
    }, [filtroPatente, filtroEstado]);

    const handleAgregar = () => {
        setAlquilerSeleccionado(null);
        setVista("form");
    };

    const handleGuardar = async (alquilerForm) => {
        try {
            await crearAlquiler(alquilerForm);
            await cargarAlquileres(pagina, 5, false);
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
            
            // Si estamos en vista detalle, recargar el detalle
            if (vista === "detalle") {
                const data = await obtenerAlquiler(alquiler.id);
                setAlquilerSeleccionado(data.alquiler);
            }
            
            await cargarAlquileres(pagina, 5, false);
        } catch (err) {
            console.error(err);
            alert(err.error || "Error al finalizar el alquiler");
        }
    };

    const handleVerDetalle = async (alquiler) => {
        try {
            const data = await obtenerAlquiler(alquiler.id);
            setAlquilerSeleccionado(data.alquiler);
            setVista("detalle");
        } catch (err) {
            console.error("Error cargando detalle:", err);
            alert("No se pudo cargar el detalle del alquiler.");
        }
    };

    const handleVolverALista = () => {
        setVista("lista");
        setAlquilerSeleccionado(null);
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
                        VerDetalle={handleVerDetalle}
                        Agregar={handleAgregar}
                        Pagina={pagina}
                        RegistrosTotal={RegistrosTotal}
                        Paginas={Paginas}
                        Buscar={cargarAlquileres}
                        FiltroPatente={filtroPatente}
                        setFiltroPatente={setFiltroPatente}
                        FiltroEstado={filtroEstado}
                        setFiltroEstado={setFiltroEstado}
                    />
                </div>
            )}

            {vista === "form" && (
                <div className="fade-in">
                    <AlquileresForm
                        Alquiler={alquilerSeleccionado}
                        Guardar={handleGuardar}
                        Cancelar={handleVolverALista}
                    />
                </div>
            )}

            {vista === "detalle" && (
                <div className="fade-in">
                    <AlquileresDetail
                        Alquiler={alquilerSeleccionado}
                        Volver={handleVolverALista}
                        Finalizar={handleFinalizar}
                    />
                </div>
            )}
        </div>
    );
}