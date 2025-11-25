import React, { useState, useEffect } from "react";
import DaniosList from "./DaniosList";
import DaniosForm from "./DaniosForm";
import "../../styles/PageLayout.css";
import { obtenerDanios } from "../../services/daniosService";

export default function DaniosPage() {
    const [vista, setVista] = useState("lista");

    const [danios, setDanios] = useState([]);
    const [danioSeleccionado, setDanioSeleccionado] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [RegistrosTotal, setRegistrosTotal] = useState(0);
    const [Paginas, setPaginas] = useState([]);

    const [filtroPatente, setFiltroPatente] = useState("");

    const cargarDanios = async (numPagina = 1, pageSize = 5) => {
        try {
            const data = await obtenerDanios(numPagina, pageSize, filtroPatente);
            setDanios(data.danios);
            setRegistrosTotal(data.total);
            setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
            setPagina(data.page);
        } catch (err) {
            console.error("Error cargando daños:", err);
            alert("No se pudieron cargar los daños.");
        }
    };

    useEffect(() => {
        cargarDanios(1);
    }, [filtroPatente]);

    const handleAgregar = () => {
        setDanioSeleccionado(null);
        setVista("form");
    };

    const handleModificar = (danio) => {
        setDanioSeleccionado(danio);
        setVista("form");
    };

    const handleEliminar = (danio) => {
        if (window.confirm(`¿Eliminar daño ID ${danio.id_danio}?`)) {
            setDanios(danios.filter(d => d.id_danio !== danio.id_danio));
        }
    };

    const handleGuardar = (danioForm) => {
        let nuevaLista;
        if (danioForm.id_danio) {
            nuevaLista = danios.map(d => (d.id_danio === danioForm.id_danio ? danioForm : d));
        } else {
            danioForm.id_danio = Date.now(); // temporal
            nuevaLista = [...danios, danioForm];
        }

        setDanios(nuevaLista);
        setVista("lista");
    };

    const handleVolverALista = () => setVista("lista");

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
                        RegistrosTotal={RegistrosTotal}
                        Paginas={Paginas}
                        Buscar={cargarDanios}
                        FiltroPatente={filtroPatente}
                        setFiltroPatente={setFiltroPatente}
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
