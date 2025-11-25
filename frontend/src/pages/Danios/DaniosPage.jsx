import React, { useState, useEffect } from "react";
import DaniosList from "./DaniosList";
import DaniosForm from "./DaniosForm";
import "../../styles/PageLayout.css";
import { obtenerDaniosPorAlquiler, crearDanio, actualizarDanio, eliminarDanio } from "../../services/daniosService";

export default function DaniosPage() {
    const [vista, setVista] = useState("lista");

    const [todosLosDanios, setTodosLosDanios] = useState([]);
    const [danios, setDanios] = useState([]);
    const [danioSeleccionado, setDanioSeleccionado] = useState(null);
    const [pagina, setPagina] = useState(1);

    // const [filtroIdDanio, setFiltroIdDanio] = useState("");
    // const [filtroIdAlquiler, setFiltroIdAlquiler] = useState("");

    useEffect(() => {
        const datosSimulados = [
            { IdDanio: 1, IdAlquiler: 100, Descripcion: "Raspones en paragolpes", Monto: 25000 },
            { IdDanio: 2, IdAlquiler: 101, Descripcion: "Rotura de espejo lateral", Monto: 18000 },
            { IdDanio: 3, IdAlquiler: 100, Descripcion: "Limpieza profunda (barro)", Monto: 8000 },
        ];

        setTodosLosDanios(datosSimulados);
        setDanios(datosSimulados);
    }, []);

    const handleBuscar = (numPagina) => {
        setPagina(numPagina || 1);

        const filtrados = todosLosDanios.filter((d) => {
            const cumpleIdDanio =
                filtroIdDanio === "" || d.IdDanio.toString().includes(filtroIdDanio);

            const cumpleIdAlquiler =
                filtroIdAlquiler === "" || d.IdAlquiler.toString().includes(filtroIdAlquiler);

            return cumpleIdDanio && cumpleIdAlquiler;
        });

        setDanios(filtrados);
    };

    const handleAgregar = () => {
        setDanioSeleccionado(null);
        setVista("form");
    };

    const handleModificar = (danio) => {
        setDanioSeleccionado(danio);
        setVista("form");
    };

    const handleEliminar = (danio) => {
        if (window.confirm(`¿Eliminar daño ID ${danio.IdDanio}?`)) {
            const nuevaLista = todosLosDanios.filter(d => d.IdDanio !== danio.IdDanio);
            setTodosLosDanios(nuevaLista);
            setDanios(nuevaLista);
        }
    };

    const handleGuardar = (danioForm) => {
        let nuevaBase;

        if (danioForm.IdDanio) {
            nuevaBase = todosLosDanios.map((d) =>
                d.IdDanio === danioForm.IdDanio ? danioForm : d
            );
        } else {
            danioForm.IdDanio = Date.now(); 
            nuevaBase = [...todosLosDanios, danioForm];
        }

        setTodosLosDanios(nuevaBase);
        setDanios(nuevaBase);

        setFiltroIdDanio("");
        setFiltroIdAlquiler("");
        setVista("lista");
    };

    const handleVolverALista = () => {
        setVista("lista");
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Daños</h2>
            <p className="page-subtitle">
                Registrá y administrá los daños asociados a cada alquiler.
            </p>

            {vista === "lista" && (
                <div className="fade-in">
                    <DaniosList
                        Danios={danios}
                        Modificar={handleModificar}
                        Eliminar={handleEliminar}
                        Agregar={handleAgregar}
                        Pagina={pagina}
                        RegistrosTotal={danios.length}
                        Paginas={[1]}
                        Buscar={handleBuscar}
                        FiltroIdDanio={filtroIdDanio}
                        setFiltroIdDanio={setFiltroIdDanio}
                        FiltroIdAlquiler={filtroIdAlquiler}
                        setFiltroIdAlquiler={setFiltroIdAlquiler}
                    />
                </div>
            )}

            {vista === "form" && (
                <div className="fade-in">
                    <DaniosForm
                        Danio={danioSeleccionado}
                        Guardar={handleGuardar}
                        Cancelar={handleVolverALista}
                    />
                </div>
            )}
        </div>
    );
}
