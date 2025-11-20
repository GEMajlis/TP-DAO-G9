import React, { useState, useEffect } from "react";
import AlquileresList from "./AlquileresList";
import AlquileresForm from "./AlquileresForm";
import "../../styles/PageLayout.css";

export default function AlquileresPage() {
    const [vista, setVista] = useState("menu");

    const [todosLosAlquileres, setTodosLosAlquileres] = useState([]);
    const [alquileres, setAlquileres] = useState([]);

    const [alquilerEditando, setAlquilerEditando] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [volverA, setVolverA] = useState("menu");

    const [filtroPatente, setFiltroPatente] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    useEffect(() => {
        const datosSimulados = [
            { IdAlquiler: 1, Patente: "AB123CD", DNICliente: "35111222", FechaInicio: "2023-11-01", FechaFin: "2023-11-05", Costo: 50000, DNIEmpleado: "20999888", NroReserva: 100 },
            { IdAlquiler: 2, Patente: "AE555EE", DNICliente: "40555666", FechaInicio: "2025-01-10", FechaFin: "2025-12-12", Costo: 30000, DNIEmpleado: "20999888", NroReserva: null }, 
            { IdAlquiler: 3, Patente: "ZZ999XX", DNICliente: "12333444", FechaInicio: "2023-11-15", FechaFin: "2023-11-20", Costo: 85000, DNIEmpleado: "20999888", NroReserva: 102 },
        ];
        setTodosLosAlquileres(datosSimulados);

        const alquileresConEstado = calcularEstados(datosSimulados);
        setAlquileres(alquileresConEstado);
    }, []);

    // Función auxiliar para calcular estado según fecha
    const calcularEstados = (listaAlquileres) => {
        const hoy = new Date().toISOString().split('T')[0];

        return listaAlquileres.map(a => {
            let estadoCalculado = "Finalizado";
            if (a.FechaFin >= hoy) {
                estadoCalculado = "Activo";
            }
            return { ...a, Estado: estadoCalculado };
        });
    };

    // LÓGICA DE BÚSQUEDA
    const handleBuscar = (numPagina) => {
        setPagina(numPagina || 1);

        // Primero calculamos los estados actuales de todos
        const listaConEstados = calcularEstados(todosLosAlquileres);

        const resultado = listaConEstados.filter((a) => {
            const cumplePatente = a.Patente.toLowerCase().includes(filtroPatente.toLowerCase());

            let cumpleEstado = true;
            if (filtroEstado !== "" && filtroEstado !== "Todos") {
                cumpleEstado = a.Estado === filtroEstado;
            }

            return cumplePatente && cumpleEstado;
        });

        setAlquileres(resultado);
    };

    // NAVEGACIÓN
    const handleAgregar = (origen) => {
        setAlquilerEditando(null);
        setVolverA(origen);
        setVista("form");
    };

    const handleModificar = (alquiler) => {
        setAlquilerEditando(alquiler);
        setVolverA("lista");
        setVista("form");
    };

    const handleEliminar = (alquiler) => {
        if (window.confirm(`¿Estás seguro de eliminar el alquiler del vehículo ${alquiler.Patente}?`)) {
            const nuevaLista = todosLosAlquileres.filter(a => a.IdAlquiler !== alquiler.IdAlquiler);
            setTodosLosAlquileres(nuevaLista);

            // Actualizamos la vista filtrada
            const listaConEstados = calcularEstados(nuevaLista);
            setAlquileres(listaConEstados);
        }
    };

    const handleGuardar = (alquilerForm) => {
        console.log("Guardando Alquiler:", alquilerForm);
        let nuevaBase;

        if (alquilerForm.IdAlquiler) {
            nuevaBase = todosLosAlquileres.map((a) => a.IdAlquiler === alquilerForm.IdAlquiler ? alquilerForm : a);
        } else {
            alquilerForm.IdAlquiler = Date.now();
            nuevaBase = [...todosLosAlquileres, alquilerForm];
        }

        setTodosLosAlquileres(nuevaBase);

        // Recalculamos estados para la vista
        const listaConEstados = calcularEstados(nuevaBase);
        setAlquileres(listaConEstados);

        setFiltroPatente("");
        setFiltroEstado("");

        setVista("lista");
    };

    const handleVolverDesdeForm = () => {
        setVista(volverA);
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Alquileres</h2>
            <p className="page-subtitle">
                Administración de contratos de alquiler y reservas.
            </p>

            {vista === "menu" && (
                <div className="page-content fade-in">
                    <div className="page-card">
                        <h3>Listado de Alquileres</h3>
                        <p>Historial y alquileres vigentes.</p>
                        <button className="btn-primary" onClick={() => setVista("lista")}>Ver listado</button>
                    </div>
                    <div className="page-card">
                        <h3>Nuevo Alquiler</h3>
                        <p>Registrar una salida de vehículo.</p>
                        <button className="btn-primary" onClick={() => handleAgregar("menu")}>Registrar</button>
                    </div>
                </div>
            )}

            {vista === "lista" && (
                <div className="fade-in">
                    <AlquileresList
                        Alquileres={alquileres} // Esta lista ya tiene el 'Estado' calculado
                        Modificar={handleModificar}
                        Eliminar={handleEliminar}
                        Agregar={() => handleAgregar("lista")}
                        Pagina={pagina}
                        RegistrosTotal={alquileres.length}
                        Paginas={[1]}
                        Buscar={handleBuscar}

                        // Props de Filtro
                        FiltroPatente={filtroPatente}
                        setFiltroPatente={setFiltroPatente}
                        // IMPORTANTE: Pasamos los estados del filtro por ESTADO (Activo/Finalizado) al buscador
                        FiltroEstado={filtroEstado}
                        setFiltroEstado={setFiltroEstado}

                        Volver={() => setVista("menu")}
                    />
                </div>
            )}

            {vista === "form" && (
                <div className="fade-in">
                    <AlquileresForm
                        Alquiler={alquilerEditando}
                        Guardar={handleGuardar}
                        Cancelar={handleVolverDesdeForm}
                    />
                    <div className="text-center mt-4 mb-3">
                        <button className="btn btn-secondary px-4" onClick={handleVolverDesdeForm}>
                            <i className="fa-solid fa-arrow-left me-2"></i>
                            {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}