import React, { useState, useEffect } from "react";
import { obtenerActivos } from "../../services/mantenimientosService";

export default function MantenimientoForm({ Guardar, Cancelar, loading }) {

    const [form, setForm] = useState({
        dni_empleado: "",
        patente: ""
    });

    const [patenteEnMantenimiento, setPatenteEnMantenimiento] = useState(false);

    // Cada vez que cambia la patente, validamos si está activa
    useEffect(() => {
        const validar = async () => {
            if (!form.patente) {
                setPatenteEnMantenimiento(false);
                return;
            }

            try {
                const activos = await obtenerActivos(); // lista real
                const existe = activos.some(m => m.patente === form.patente);

                setPatenteEnMantenimiento(existe);
            } catch (err) {
                console.error("Error validando patente:", err);
            }
        };

        validar();
    }, [form.patente]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Guardar(form); // NO BLOQUEO, solo aviso visual
    };

    return (
        <div
            className="card shadow-lg border-0 w-100"
            style={{ maxWidth: "700px", margin: "0 auto", borderRadius: "12px" }}
        >
            <div className="card-header bg-white border-bottom-0 pt-3 pb-1">
                <h4 className="card-title mb-0 text-primary fw-bold">
                    <i className="fa-solid fa-plus me-2"></i>
                    Iniciar Mantenimiento
                </h4>
            </div>

            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>

                    {/* DNI */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">DNI del Empleado</label>
                        <input
                            type="number"
                            className="form-control"
                            name="dni_empleado"
                            value={form.dni_empleado}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="12345678"
                        />
                    </div>

                    {/* Patente */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Patente del Vehículo</label>
                        <input
                            type="text"
                            className={`form-control ${patenteEnMantenimiento ? "is-invalid" : ""}`}
                            name="patente"
                            value={form.patente}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="ABC123"
                        />

                        {patenteEnMantenimiento && (
                            <div className="invalid-feedback d-block">
                                ⚠ Este vehículo ya tiene un mantenimiento activo.
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="d-flex justify-content-end gap-3 pt-3 border-top">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={Cancelar}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Guardando..." : "Iniciar"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}
