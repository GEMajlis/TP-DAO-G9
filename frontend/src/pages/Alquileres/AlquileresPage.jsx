import React, { useState, useEffect } from "react";
import AlquileresList from "./AlquileresList";
import AlquileresForm from "./AlquileresForm";
import "../../styles/PageLayout.css";

export default function AlquileresPage() {
    const [vista, setVista] = useState("lista");

    const [todosLosAlquileres, setTodosLosAlquileres] = useState([]);
    const [alquileres, setAlquileres] = useState([]);
    const [alquilerEditando, setAlquilerEditando] = useState(null);
    const [pagina, setPagina] = useState(1);

    const [filtroIdAlquiler, setFiltroIdAlquiler] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    useEffect(() => {
        const datosSimulados = [
            { IdAlquiler: 1, Patente: "AB123CD", DNICliente: "35111222", FechaInicio: "2023-11-01", FechaFin: "2023-11-05", Costo: 50000, DNIEmpleado: "20999888", NroReserva: 100 },
            { IdAlquiler: 2, Patente: "AE555EE", DNICliente: "40555666", FechaInicio: "2025-01-10", FechaFin: "2025-12-12", Costo: 30000, DNIEmpleado: "20999888", NroReserva: null },
            { IdAlquiler: 3, Patente: "ZZ999XX", DNICliente: "12333444", FechaInicio: "2023-11-15", FechaFin: "2023-11-20", Costo: 85000, DNIEmpleado: "20999888", NroReserva: 102 },
        ];

        setTodosLosAlquileres(datosSimulados);
        setAlquileres(calcularEstados(datosSimulados));
    }, []);

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

    const handleBuscar = (numPagina) => {
        setPagina(numPagina || 1);
        const listaConEstados = calcularEstados(todosLosAlquileres);
        const resultado = listaConEstados.filter((a) => {
            const cumpleId = filtroIdAlquiler === "" || a.IdAlquiler.toString().includes(filtroIdAlquiler);
            const cumpleEstado = filtroEstado === "" || filtroEstado === "Todos" ? true : a.Estado === filtroEstado;
            return cumpleId && cumpleEstado;
        });
        setAlquileres(resultado);
    };

    const handleAgregar = () => {
        setAlquilerEditando(null);
        setVista("form");
    };

    const handleModificar = (alquiler) => {
        setAlquilerEditando(alquiler);
        setVista("form");
    };

    const handleEliminar = (alquiler) => {
        if (window.confirm(`¿Estás seguro de eliminar el alquiler del vehículo ${alquiler.Patente}?`)) {
            const nuevaLista = todosLosAlquileres.filter(a => a.IdAlquiler !== alquiler.IdAlquiler);
            setTodosLosAlquileres(nuevaLista);
            setAlquileres(calcularEstados(nuevaLista));
        }
    };

    const handleGuardar = (alquilerForm) => {
        console.log("Guardando Alquiler:", alquilerForm);
        let nuevaBase;

        if (alquilerForm.IdAlquiler) {
            nuevaBase = todosLosAlquileres.map((a) =>
                a.IdAlquiler === alquilerForm.IdAlquiler ? alquilerForm : a
            );
        } else {
            alquilerForm.IdAlquiler = Date.now();
            nuevaBase = [...todosLosAlquileres, alquilerForm];
        }

        setTodosLosAlquileres(nuevaBase);
        setAlquileres(calcularEstados(nuevaBase));

        setFiltroIdAlquiler("");
        setFiltroEstado("");
        setVista("lista");
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
                        Modificar={handleModificar}
                        Eliminar={handleEliminar}
                        Agregar={handleAgregar}
                        Pagina={pagina}
                        RegistrosTotal={alquileres.length}
                        Paginas={[1]}
                        Buscar={handleBuscar}
                        FiltroIdAlquiler={filtroIdAlquiler}
                        setFiltroIdAlquiler={setFiltroIdAlquiler}
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
                        Alquiler={alquilerEditando}
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