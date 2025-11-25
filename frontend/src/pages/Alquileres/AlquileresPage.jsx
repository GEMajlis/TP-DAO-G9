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
            const data = await obtenerAlquileres(paginaActual, 5, filtroPatente, filtroEstado);

            setAlquileres(data.alquileres);
            setRegistrosTotal(data.total);
            setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
            setPagina(data.page);

        } catch (err) {
            console.error("Error cargando alquileres:", err);
            alert("No se pudieron cargar los alquileres.");
        }
    }, [filtroPatente, filtroEstado]); 

    const handleBuscar = async (numPagina = 1) => {
        try {
            setPagina(numPagina);
            const data = await obtenerAlquileres(numPagina, 5, filtroPatente, filtroEstado);
    
            setAlquileres(data.alquileres);
            setRegistrosTotal(data.total);
            setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
    
        } catch (err) {
          console.error("Error filtrando o paginando alquileres:", err);
        }
      };

    useEffect(() => {
        handleBuscar(1); 
    }, [filtroPatente, filtroEstado]);

    const handleAgregar = () => {
        setAlquilerSeleccionado(null);
        setVista("form");
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