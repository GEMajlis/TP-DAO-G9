import React, { useState } from "react";
import MantenimientosList from "./MantenimientosList";
import MantenimientoForm from "./MantenimientosForm";
import "../../styles/PageLayout.css";

import {
    crearMantenimiento,
    finalizarMantenimiento,
    obtenerActivos,
    obtenerTodos,
    obtenerPorId,
} from "../../services/mantenimientosService";

export default function MantenimientosPage() {

    const [vista, setVista] = useState("lista");
    const [mantenimientos, setMantenimientos] = useState([]);
    const [filtroId, setFiltroId] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const cargarActivos = async () => {
        setLoading(true);
        try {
            const data = await obtenerActivos();
            setMantenimientos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cargarTodos = async () => {
        setLoading(true);
        try {
            const data = await obtenerTodos();
            setMantenimientos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const buscarPorId = async () => {
        if (!filtroId) {
            setError("Debe ingresar un ID");
            return;
        }

        setLoading(true);
        try {
            const data = await obtenerPorId(filtroId);
            setMantenimientos([data]); // un solo objeto → lo metemos en una lista
        } catch (err) {
            setError(err.message);
            setMantenimientos([]);
        } finally {
            setLoading(false);
        }
    };

    const iniciar = () => {
        setVista("form");
    };

    const guardar = async (formData) => {
        setLoading(true);
        try {
            await crearMantenimiento(formData);
            await cargarActivos();
            setVista("lista");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const finalizar = async (patente) => {
        setLoading(true);
        try {
            await finalizarMantenimiento(patente);
            await cargarActivos();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Mantenimientos</h2>
            <p className="page-subtitle">Iniciá y finalizá mantenimientos activos.</p>

            {error && (
                <div className="alert alert-danger">
                    {error}
                    <button className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            {vista === "lista" && (
                <MantenimientosList
                    Mantenimientos={mantenimientos}
                    FiltroId={filtroId}
                    setFiltroId={setFiltroId}
                    BuscarPorId={buscarPorId}
                    CargarActivos={cargarActivos}
                    CargarTodos={cargarTodos}
                    Finalizar={finalizar}
                    Iniciar={iniciar}
                />
            )}

            {vista === "form" && (
                <MantenimientoForm
                    Guardar={guardar}
                    Cancelar={() => setVista("lista")}
                    loading={loading}
                />
            )}
        </div>
    );
}
