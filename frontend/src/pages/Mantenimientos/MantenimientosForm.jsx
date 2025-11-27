import React, { useState, useEffect } from "react";
import { obtenerActivos } from "../../services/mantenimientosService";
import { obtenerVehiculos } from "../../services/vehiculosService";
import { getEmpleados } from "../../services/empleadosService";

export default function MantenimientoForm({ Guardar, Cancelar, loading }) {

    const [form, setForm] = useState({
        dni_empleado: "",
        patente: ""
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [patenteEnMantenimiento, setPatenteEnMantenimiento] = useState(false);

    // Cargar vehículos disponibles
    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const data = await obtenerVehiculos(1, 100, "", "disponible");
                setVehiculos(data.vehiculos);
            } catch (err) {
                console.error("Error al cargar vehículos:", err);
            }
        };
        fetchVehiculos();
    }, []);

    // Cargar empleados
    useEffect(() => {
        const fetchEmpleados = async () => {
            try {
                const data = await getEmpleados();
                setEmpleados(data);
            } catch (err) {
                console.error("Error al cargar empleados:", err);
            }
        };
        fetchEmpleados();
    }, []);

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
            <div className="card-header bg-white border-bottom-0 pt-3 pb-1" style={{ borderRadius: "12px 12px 0 0" }}>
                <h4 className="card-title mb-0 text-primary fw-bold">
                    <i className="fa-solid fa-plus me-2"></i>
                    Iniciar Mantenimiento
                </h4>
                <p className="text-muted small mb-0 mt-1 ms-4">
                    Seleccione el vehículo y empleado responsable:
                </p>
            </div>

            <div className="card-body p-4 pt-2">
                <form onSubmit={handleSubmit}>

                    {/* Fila: Vehículo y Empleado */}
                    <div className="row g-3 mb-3">
                        
                        {/* Patente */}
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-car"></i>
                                </span>
                                <div className="form-floating">
                                    <select
                                        className={`form-select border-start-0 ps-2 ${patenteEnMantenimiento ? "is-invalid" : ""}`}
                                        id="patente"
                                        name="patente"
                                        value={form.patente}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        style={{ zIndex: 0 }}
                                    >
                                        <option value="">Seleccione un vehículo</option>
                                        {vehiculos.map(v => (
                                            <option key={v.patente} value={v.patente}>
                                                {v.modelo} ({v.patente})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="patente" style={{ backgroundColor: "transparent" }} className="ps-2">
                                        Vehículo
                                    </label>
                                    {patenteEnMantenimiento && (
                                        <div className="invalid-feedback">
                                            ⚠ Este vehículo ya tiene un mantenimiento activo.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DNI Empleado */}
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-user-gear"></i>
                                </span>
                                <div className="form-floating">
                                    <select
                                        className="form-select border-start-0 ps-2"
                                        id="dni_empleado"
                                        name="dni_empleado"
                                        value={form.dni_empleado}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        style={{ zIndex: 0 }}
                                    >
                                        <option value="">Seleccione un empleado</option>
                                        {empleados.map(emp => (
                                            <option key={emp.DNI} value={emp.DNI}>
                                                {emp.Nombre} {emp.Apellido} ({emp.DNI})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="dni_empleado" style={{ backgroundColor: "transparent" }} className="ps-2">
                                        Empleado Responsable
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Botones */}
                    <div className="d-flex justify-content-center gap-3 pt-3 pb-2 border-top">
                        <button
                            type="button"
                            className="btn-secondary px-4 fw-bold"
                            onClick={Cancelar}
                            disabled={loading}
                        >
                            <i className="fa-solid fa-times me-2"></i>Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary px-4 fw-bold"
                            disabled={loading}
                        >
                            <i className="fa-solid fa-save me-2"></i>
                            {loading ? "Guardando..." : "Iniciar"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
