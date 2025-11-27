import React, { useState, useEffect } from "react";
import { obtenerVehiculos } from "../../services/vehiculosService";
import { getClientes } from "../../services/clientesService";

export default function ReservasForm({ Reserva, Guardar, Cancelar }) {
    const [form, setForm] = useState({
        IdReserva: Reserva?.IdReserva || "",
        DNICliente: Reserva?.DNICliente || "",
        Patente: Reserva?.Patente || "",
        FechaInicio: Reserva?.FechaInicio || "",
        FechaFin: Reserva?.FechaFin || "",
        FechaReserva: Reserva?.FechaReserva || "",
        Estado: Reserva?.Estado || "",
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [clientes, setClientes] = useState([]);

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

    // Cargar clientes
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filtramos los campos de solo lectura (Estado, FechaReserva) antes de guardar
        const { Estado, FechaReserva, ...dataAGuardar } = form;
        Guardar(dataAGuardar);
    };

    // Estilo inline para forzar transparencia en labels
    const labelStyle = { backgroundColor: "transparent" };

    return (
        <>
            <div
                className="card shadow-lg border-0 rounded-3 w-100"
                style={{ maxWidth: "800px", margin: "0 auto" }}
            >
                {/* Encabezado */}
                <div className="card-header bg-white border-bottom-0 pt-3 pb-1">
                    <h4 className="card-title mb-0 text-primary fw-bold">
                        <i
                            className={`fa-solid ${form.IdReserva ? "fa-pen-to-square" : "fa-plus"
                                } me-2`}
                        ></i>
                        {/* ----- INICIO CAMBIO: Título corregido ----- */}
                        {form.IdReserva ? "Modificar Reserva" : "Registrar Nueva Reserva"}
                        {/* ----- FIN CAMBIO ----- */}
                    </h4>
                    <p className="text-muted small mb-0 mt-1 ms-4">
                        Complete los datos de la Reserva a continuación.
                    </p>
                </div>

                {/* Cuerpo */}
                <div className="card-body p-4 pt-2">
                    <form onSubmit={handleSubmit}>
                        
                        {/* ----- INICIO CAMBIO: Fila de solo lectura para MODO EDICIÓN ----- */}
                        {form.IdReserva && (
                            <div className="row g-3 mb-3">
                                {/* Columna 1: Fecha de Reserva */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputFechaReserva"
                                            value={form.FechaReserva || "N/A"}
                                            readOnly
                                            disabled
                                        />
                                        <label htmlFor="inputFechaReserva" style={labelStyle}>
                                            Fecha de Creación
                                        </label>
                                    </div>
                                </div>
                                {/* Columna 2: Estado */}
                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="inputEstado"
                                            value={form.Estado || "N/A"}
                                            readOnly
                                            disabled
                                        />
                                        <label htmlFor="inputEstado" style={labelStyle}>Estado Actual</label>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* ----- FIN CAMBIO ----- */}


                        {/* Fila 1 (ahora Fila 2): DNI del Cliente y Patente del Vehículo */}
                        <div className="row g-3 mb-3">
                            {/* Columna 1: Cliente */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-user"></i>
                                    </span>
                                    <div className="form-floating">
                                        <select
                                            className="form-select border-start-0 ps-2"
                                            id="inputDniCliente"
                                            name="DNICliente" 
                                            value={form.DNICliente}
                                            onChange={handleChange}
                                            required
                                            autoFocus 
                                            style={{ zIndex: 0 }}
                                        >
                                            <option value="">Seleccione un cliente</option>
                                            {clientes.map(c => (
                                                <option key={c.DNI} value={c.DNI}>
                                                    {c.Nombre} {c.Apellido} ({c.DNI})
                                                </option>
                                            ))}
                                        </select>
                                        <label
                                            htmlFor="inputDniCliente"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Cliente
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Columna 2: Vehículo */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-car"></i>
                                    </span>
                                    <div className="form-floating">
                                        <select
                                            className="form-select border-start-0 ps-2"
                                            id="inputPatente"
                                            name="Patente" 
                                            value={form.Patente}
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
                                        <label
                                            htmlFor="inputPatente"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Vehículo
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fila 2 (ahora Fila 3): Fecha de Inicio y Fecha de Fin */}
                        <div className="row g-3 mb-3">
                            {/* Columna 1: Fecha de Inicio */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-calendar-days"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control border-start-0 ps-2"
                                            id="inputFechaInicio"
                                            name="FechaInicio"
                                            placeholder="Fecha de Inicio"
                                            value={form.FechaInicio}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputFechaInicio"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Fecha de Inicio
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Columna 2: Fecha de Fin */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-calendar-days"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control border-start-0 ps-2"
                                            id="inputFechaFin"
                                            name="FechaFin"
                                            placeholder="Fecha de Fin"
                                            value={form.FechaFin}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputFechaFin"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Fecha de Fin
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Botones de Acción */}
                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button
                                type="button"
                                className="btn btn-secondary px-4 btn-hover-scale btn-lighter-hover"
                                onClick={Cancelar}
                            >
                                <i className="fa-solid fa-times me-2"></i>
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                            >
                                <i className="fa-solid fa-save me-2"></i>
                                {form.IdReserva ? "Guardar Cambios" : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}