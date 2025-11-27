import React, { useState, useEffect } from "react";
import MultasList from "./MultasList";
import MultasForm from "./MultasForm";
import "../../styles/PageLayout.css";

import {
    getMultasPorAlquiler,
    createMulta,
    updateMulta,
    getMultasTodas,
} from "../../services/multasService";

export default function MultasPage() {
    const [vista, setVista] = useState("lista");

    const [multas, setMultas] = useState([]);

    // paginación
    const [pagina, setPagina] = useState(1);
    const [registrosTotal, setRegistrosTotal] = useState(0);
    const pageSize = 10;

    const [paginas, setPaginas] = useState([]);

    // filtro
    const [filtroAlquiler, setFiltroAlquiler] = useState("");

    const [multaSeleccionada, setMultaSeleccionada] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ======================================================
    // CARGA INICIAL: TODAS LAS MULTAS
    // ======================================================
    useEffect(() => {
        const cargarMultas = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await getMultasTodas();
                prepararPaginacion(data);
            } catch (err) {
                setError("Error cargando multas");
            } finally {
                setLoading(false);
            }
        };

        cargarMultas();
    }, []);

    // ======================================================
    // PAGINACIÓN (FRONTEND)
    // ======================================================
    const prepararPaginacion = (data) => {
        setRegistrosTotal(data.length);

        const totalPaginas = Math.max(1, Math.ceil(data.length / pageSize));
        const paginasArray = [];

        for (let i = 1; i <= totalPaginas; i++) paginasArray.push(i);

        setPaginas(paginasArray);

        setMultas(data);

        // mantener página si es válida
        setPagina((prev) => (prev > totalPaginas ? 1 : prev));
    };

    const multasPaginadas = multas.slice(
        (pagina - 1) * pageSize,
        pagina * pageSize
    );

    // ======================================================
    // CAMBIO DE PÁGINA
    // ======================================================
    const CambiarPagina = (nuevaPagina) => {
        setPagina(Number(nuevaPagina));
    };

    // ======================================================
    // BÚSQUEDA POR ID ALQUILER
    // ======================================================
    const handleBuscar = async (p = 1) => {
        if (!filtroAlquiler) {
            setError("Debe ingresar un ID de Alquiler");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getMultasPorAlquiler(filtroAlquiler);
            prepararPaginacion(data);
            setPagina(Number(p));
        } catch (err) {
            setError("Error al buscar multas");
            prepararPaginacion([]);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // LIMPIAR
    // ======================================================
    const handleLimpiar = async () => {
        setFiltroAlquiler("");
        setLoading(true);
        setError(null);

        try {
            const data = await getMultasTodas();
            prepararPaginacion(data);
        } catch (err) {
            setError("Error recargando multas");
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // AGREGAR / MODIFICAR / GUARDAR
    // ======================================================
    const handleAgregar = () => {
        setMultaSeleccionada({
            id_multa: 0,
            alquiler: "",
            motivo: "",
            monto: 0,
        });
        setVista("form");
    };

    const handleModificar = (multa) => {
        setMultaSeleccionada({
            ...multa,
            alquiler: multa.alquiler?.id_alquiler,
        });
        setVista("form");
    };

    const handleGuardar = async (form) => {
        setLoading(true);
        setError(null);

        try {
            if (form.id_multa) {
                await updateMulta(form.alquiler, form.id_multa, {
                    motivo: form.motivo,
                    monto: form.monto,
                });
            } else {
                await createMulta(form);
            }

            // recargar según si hay filtro o no
            if (filtroAlquiler) {
                await handleBuscar(pagina);
            } else {
                const data = await getMultasTodas();
                prepararPaginacion(data);
            }

            setVista("lista");
        } catch (err) {
            setError("Error guardando multa");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Multas por Alquiler</h2>
            <p className="page-subtitle">
                Buscá un alquiler por su ID para ver o agregar multas.
            </p>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <strong>Error:</strong> {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {loading && (
                <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            )}

            {vista === "lista" && !loading && (
                <MultasList
                    Multas={multasPaginadas}
                    Modificar={handleModificar}
                    Agregar={handleAgregar}
                    Pagina={pagina}
                    RegistrosTotal={registrosTotal}
                    Paginas={paginas}
                    CambiarPagina={CambiarPagina}
                    Buscar={handleBuscar}
                    Limpiar={handleLimpiar}
                    FiltroAlquiler={filtroAlquiler}
                    setFiltroAlquiler={setFiltroAlquiler}
                />
            )}

            {vista === "form" && (
                <MultasForm
                    Multa={multaSeleccionada}
                    Guardar={handleGuardar}
                    Cancelar={() => setVista("lista")}
                    loading={loading}
                />
            )}
        </div>
    );
}
