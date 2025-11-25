import React, { useState, useEffect } from "react";
import { obtenerVehiculos } from "../../services/vehiculosService";
import { getClientes } from "../../services/clientesService";
import { getEmpleados } from "../../services/empleadosService";

export default function AlquileresForm({ Guardar, Cancelar }) {
    const hoy = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        vehiculo_patente: "",
        cliente_dni: "",
        fecha_inicio: hoy,
        fecha_fin: "",
        total_pago: "",
        empleado_dni: "",
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);

    // Traer vehículos disponibles
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

    // Traer clientes
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await getClientes();
                setClientes(data);
            } catch (err) {
                console.error("Error al cargar clientes:", err);
            }
        };
        fetchClientes();
    }, []);

    // Traer empleados
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Guardar(form);
    };

    const labelStyle = { backgroundColor: "transparent" };

    return (
        <div className="card shadow-lg border-0 w-100" style={{ maxWidth: "900px", margin: "0 auto", borderRadius: "12px" }}>
            <div className="card-header bg-white border-bottom-0 pt-3 pb-1" style={{ borderRadius: "12px 12px 0 0" }}>
                <h4 className="card-title mb-0 text-primary fw-bold">
                    <i className="fa-solid fa-file-circle-plus me-2"></i>
                    Registrar Nuevo Alquiler
                </h4>
                <p className="text-muted small mb-0 mt-1 ms-4">
                    Complete los datos del contrato de alquiler:
                </p>
            </div>

            <div className="card-body p-4 pt-2">
                <form onSubmit={handleSubmit}>

                    {/* Fila 1: Vehículo y Cliente */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-car"></i>
                                </span>
                                <div className="form-floating">
                                    <select
                                        className="form-select border-start-0 ps-2"
                                        id="vehiculo_patente"
                                        name="vehiculo_patente"
                                        value={form.vehiculo_patente}
                                        onChange={handleChange}
                                        required
                                        style={{ zIndex: 0 }}
                                    >
                                        <option value="">Seleccione un vehículo</option>
                                        {vehiculos.map(v => (
                                            <option key={v.patente} value={v.patente}>
                                                {v.modelo} ({v.patente})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="vehiculo_patente" style={labelStyle} className="ps-2">
                                        Vehículo
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-user"></i>
                                </span>
                                <div className="form-floating">
                                    <select
                                        className="form-select border-start-0 ps-2"
                                        id="cliente_dni"
                                        name="cliente_dni"
                                        value={form.cliente_dni}
                                        onChange={handleChange}
                                        required
                                        style={{ zIndex: 0 }}
                                    >
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map(c => (
                                            <option key={c.DNI} value={c.DNI}>
                                                {c.Nombre} {c.Apellido} ({c.DNI})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="cliente_dni" style={labelStyle} className="ps-2">
                                        Cliente
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: Fecha Inicio y Fecha Fin */}
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-calendar-day"></i>
                                </span>
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control border-start-0 ps-2 bg-light"
                                        id="fecha_inicio"
                                        name="fecha_inicio"
                                        value={form.fecha_inicio}
                                        readOnly
                                        style={{ zIndex: 0 }}
                                    />
                                    <label htmlFor="fecha_inicio" style={labelStyle} className="ps-2">
                                        Fecha de Inicio
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-calendar-check"></i>
                                </span>
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        className="form-control border-start-0 ps-2"
                                        id="fecha_fin"
                                        name="fecha_fin"
                                        value={form.fecha_fin}
                                        onChange={handleChange}
                                        min={form.fecha_inicio}
                                        required
                                        style={{ zIndex: 0 }}
                                    />
                                    <label htmlFor="fecha_fin" style={labelStyle} className="ps-2">
                                        Fecha de Fin
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fila 3: Total y Empleado */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-dollar-sign"></i>
                                </span>
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control border-start-0 ps-2"
                                        id="total_pago"
                                        name="total_pago"
                                        value={form.total_pago}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="Costo Total"
                                        style={{ zIndex: 0 }}
                                    />
                                    <label htmlFor="total_pago" style={labelStyle} className="ps-2">
                                        Costo Total
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-id-card"></i>
                                </span>
                                <div className="form-floating">
                                    <select
                                        className="form-select border-start-0 ps-2"
                                        id="empleado_dni"
                                        name="empleado_dni"
                                        value={form.empleado_dni}
                                        onChange={handleChange}
                                        required
                                        style={{ zIndex: 0 }}
                                    >
                                        <option value="">Seleccione un empleado</option>
                                        {empleados.map(emp => (
                                            <option key={emp.DNI} value={emp.DNI}>
                                                {emp.Nombre} {emp.Apellido} ({emp.DNI})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="empleado_dni" style={labelStyle} className="ps-2">
                                        Empleado
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="d-flex justify-content-center gap-3 pt-3 pb-2 border-top">
                        <button type="button" className="btn-secondary px-4 fw-bold" onClick={Cancelar}>
                            <i className="fa-solid fa-times me-2"></i>Cancelar
                        </button>
                        <button type="submit" className="btn-primary px-4 fw-bold">
                            <i className="fa-solid fa-save me-2"></i>Registrar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
