import React, { useState, useEffect } from "react";
import DaniosList from "./DaniosList";
import DaniosForm from "./DaniosForm";
import "../../styles/PageLayout.css";
import { obtenerDanios, crearDanio, actualizarDanio } from "../../services/daniosService";

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

    const handleGuardar = async (danioForm) => {
        try {
            if (danioSeleccionado) {
                await actualizarDanio(
                    danioForm.id_alquiler,
                    danioForm.id_danio,
                    { descripcion: danioForm.descripcion, monto: Number(danioForm.monto) }
                );
            } else {
                await crearDanio({
                    id_alquiler: danioForm.id_alquiler,
                    descripcion: danioForm.descripcion,
                    monto: Number(danioForm.monto)
                });
            }

            await cargarDanios(pagina);

            setVista("lista");

        } catch (err) {
            console.error("Error guardando daño:", err);
            alert("No se pudo guardar el daño.");
        }
    };

    const handleVolverALista = () => setVista("lista");

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Daños</h2>
            <p className="page-subtitle">
                Registrá y administrá los daños asociados a cada alquiler.
            </p>

            {vista === "lista" && (
                <DaniosList
                    Danios={danios}
                    Modificar={handleModificar}
                    Agregar={handleAgregar}
                    Pagina={pagina}
                    RegistrosTotal={RegistrosTotal}
                    Paginas={Paginas}
                    Buscar={cargarDanios}
                    FiltroPatente={filtroPatente}
                    setFiltroPatente={setFiltroPatente}
                />
            )}

            {vista === "form" && (
                <DaniosForm
                    Danio={danioSeleccionado}
                    Guardar={handleGuardar}
                    Cancelar={handleVolverALista}
                />
            )}
        </div>
    );
}
