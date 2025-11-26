import React, { useState } from "react";
import MultasList from "./MultasList";
import MultasForm from "./MultasForm";
import "../../styles/PageLayout.css";

import {
    getMultasPorAlquiler,
    createMulta,
    updateMulta,
} from "../../services/multasService";

export default function MultasPage() {
    const [vista, setVista] = useState("lista");

    const [multas, setMultas] = useState([]);
    const [filtroAlquiler, setFiltroAlquiler] = useState("");
    const [multaSeleccionada, setMultaSeleccionada] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBuscar = async () => {
        if (!filtroAlquiler) {
            setError("Debe ingresar un ID de Alquiler para buscar multas.");
            setMultas([]);
            return;
        }
        
        setLoading(true);
        setError(null);
        setMultas([]);

        try {
            const data = await getMultasPorAlquiler(filtroAlquiler);
            setMultas(data);

            if (data.length === 0) {
                setError("No se encontraron multas para el ID de Alquiler: " + filtroAlquiler);
            }
        } catch (err) {
            console.error("Error filtrando multas:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAgregar = () => {
        setMultaSeleccionada({
            id_multa: 0,
            alquiler: "",
            motivo: "",
            monto: 0
        });
        setVista("form");
    };

    const handleModificar = (multa) => {
        setMultaSeleccionada({
            ...multa,
            alquiler: filtroAlquiler   // <-- ESTA ES LA CLAVE
        });
        setVista("form");
    };

    const handleGuardar = async (form) => {
        setLoading(true);
        setError(null);

        try {
            if (form.id_multa) {
                const datosUpdate = {
                    motivo: form.motivo,
                    monto: form.monto
                };
                await updateMulta(form.alquiler, form.id_multa, datosUpdate);

            } else {
                await createMulta(form);
            }

            // Volvemos a cargar las multas
            await handleBuscar();
            setVista("lista");

        } catch (err) {
            console.error("Error guardando multa:", err);
            setError(err.message || "No se pudo guardar la multa.");
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiar = () => {
        setFiltroAlquiler("");
        setMultas([]);
        setError(null);
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
                    <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
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
                <div className="fade-in">
                    <MultasList
                        Multas={multas}
                        Modificar={handleModificar}
                        Agregar={handleAgregar}
                        Buscar={handleBuscar}
                        Limpiar={handleLimpiar}
                        FiltroAlquiler={filtroAlquiler}
                        setFiltroAlquiler={setFiltroAlquiler}
                    />
                </div>
            )}

            {vista === "form" && (
                <div className="fade-in">
                    <MultasForm
                        Multa={multaSeleccionada}
                        Guardar={handleGuardar}
                        Cancelar={() => setVista("lista")}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
}
