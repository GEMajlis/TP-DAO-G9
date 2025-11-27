import React, { useState, useEffect } from "react";
import { obtenerVehiculos } from "../../services/vehiculosService";
import { getClientes } from "../../services/clientesService";
import { getEmpleados } from "../../services/empleadosService";
import { getReservasHoy } from "../../services/reservasService";

export default function AlquileresForm({ Guardar, Cancelar }) {
    const hoy = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        vehiculo_patente: "",
        cliente_dni: "",
        fecha_inicio: hoy,
        empleado_dni: "",
        reserva_id: "",
    });

    const [vehiculos, setVehiculos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

    // Traer reservas del día (pendientes)
    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const data = await getReservasHoy();
                setReservas(data);
            } catch (err) {
                console.error("Error al cargar reservas:", err);
            }
        };
        fetchReservas();
    }, []);

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

    // Auto-completar campos cuando se selecciona una reserva
    useEffect(() => {
        if (reservaSeleccionada) {
            setForm(prev => ({
                ...prev,
                vehiculo_patente: reservaSeleccionada.Patente,
                cliente_dni: reservaSeleccionada.DNICliente,
                reserva_id: reservaSeleccionada.IdReserva,
            }));
        }
    }, [reservaSeleccionada]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleReservaChange = (e) => {
        const reservaId = e.target.value;
        if (reservaId) {
            const reserva = reservas.find(r => r.IdReserva === parseInt(reservaId));
            setReservaSeleccionada(reserva);
        } else {
            setReservaSeleccionada(null);
            setForm(prev => ({
                ...prev,
                vehiculo_patente: "",
                cliente_dni: "",
                reserva_id: "",
            }));
        }
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

                    {/* Fila 0: Selector de Reserva (Opcional) */}
                    <div className="row g-3 mb-3">
                        <div className="col-12">
                            <div className="alert alert-info d-flex align-items-center mb-3">
                                <i className="fa-solid fa-info-circle me-2"></i>
                                <span className="small">
                                    <strong>Opcional:</strong> Seleccione una reserva del día para auto-completar cliente y vehículo
                                </span>
                            </div>
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-calendar-check"></i>
                                </span>
                                <div className="form-floating">
                                    <select
                                        className="form-select border-start-0 ps-2"
                                        id="reserva_select"
                                        value={reservaSeleccionada?.IdReserva || ""}
                                        onChange={handleReservaChange}
                                        style={{ zIndex: 0 }}
                                    >
                                        <option value="">Sin reserva (entrada manual)</option>
                                        {reservas.map(r => (
                                            <option key={r.IdReserva} value={r.IdReserva}>
                                                Reserva #{r.IdReserva} - {r.ClienteNombre} - {r.VehiculoModelo} ({r.Patente})
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="reserva_select" style={labelStyle} className="ps-2">
                                        Reserva (Opcional)
                                    </label>
                                </div>
                                {reservaSeleccionada && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => handleReservaChange({ target: { value: "" } })}
                                        title="Limpiar reserva"
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

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
                                        disabled={!!reservaSeleccionada}
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
                                        Vehículo {reservaSeleccionada && <span className="text-muted">(desde reserva)</span>}
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
                                        disabled={!!reservaSeleccionada}
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
                                        Cliente {reservaSeleccionada && <span className="text-muted">(desde reserva)</span>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: Fecha Inicio y Empleado */}
                    <div className="row g-3 mb-4">
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
