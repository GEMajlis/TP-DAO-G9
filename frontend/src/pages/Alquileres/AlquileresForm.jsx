import React, { useState } from "react";

export default function AlquileresForm({ Alquiler, Guardar, Cancelar }) {
    const esEdicion = !!Alquiler;

    const [form, setForm] = useState({
        IdAlquiler: Alquiler?.IdAlquiler || null,
        Patente: Alquiler?.Patente || "",
        DNICliente: Alquiler?.DNICliente || "",
        FechaInicio: Alquiler?.FechaInicio || "",
        FechaFin: Alquiler?.FechaFin || "",
        Costo: Alquiler?.Costo || "",
        DNIEmpleado: Alquiler?.DNIEmpleado || "",
        NroReserva: Alquiler?.NroReserva || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Guardar(form);
    };

    const labelStyle = { backgroundColor: "transparent" };

    return (
        <>
            <style>
                {`
          .btn-hover-scale { transition: all 0.2s ease-in-out; }
          .btn-hover-scale:hover { transform: scale(1.05); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .btn-lighter-hover:hover { background-color: #979ea6 !important; border-color: #979ea6 !important; color: white !important; }
        `}
            </style>

            <div
                className="card shadow-lg border-0 w-100"
                style={{ maxWidth: "900px", margin: "0 auto", borderRadius: "12px" }}
            >
                <div
                    className="card-header bg-white border-bottom-0 pt-3 pb-1"
                    style={{ borderRadius: "12px 12px 0 0" }}
                >
                    <h4 className="card-title mb-0 text-primary fw-bold">
                        <i className={`fa-solid ${esEdicion ? "fa-pen-to-square" : "fa-file-circle-plus"} me-2`}></i>
                        {esEdicion ? "Modificar Alquiler" : "Registrar Nuevo Alquiler"}
                    </h4>
                    <p className="text-muted small mb-0 mt-1 ms-4">
                        Complete los datos del contrato de alquiler:
                    </p>
                </div>

                <div className="card-body p-4 pt-2">
                    <form onSubmit={handleSubmit}>

                        {/* Fila 1: Cliente y Vehículo */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="text" className="form-control ps-3" id="inPatente" name="Patente"
                                        value={form.Patente} onChange={handleChange} required placeholder="Patente" />
                                    <label htmlFor="inPatente" style={labelStyle}>Patente Vehículo</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="number" className="form-control ps-3" id="inDNI" name="DNICliente"
                                        value={form.DNICliente} onChange={handleChange} required placeholder="DNI" />
                                    <label htmlFor="inDNI" style={labelStyle}>DNI Cliente</label>
                                </div>
                            </div>
                        </div>

                        {/* Fila 2: Fechas */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="date" className="form-control ps-3" id="inInicio" name="FechaInicio"
                                        value={form.FechaInicio} onChange={handleChange} required />
                                    <label htmlFor="inInicio" style={labelStyle}>Fecha Inicio</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="date" className="form-control ps-3" id="inFin" name="FechaFin"
                                        value={form.FechaFin} onChange={handleChange} required />
                                    <label htmlFor="inFin" style={labelStyle}>Fecha Fin</label>
                                </div>
                            </div>
                        </div>

                        {/* Fila 3: Costo y Empleado */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <div className="form-floating">
                                        <input type="number" className="form-control ps-3" id="inCosto" name="Costo"
                                            value={form.Costo} onChange={handleChange} required placeholder="Costo" />
                                        <label htmlFor="inCosto" style={labelStyle}>Costo Total</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="number" className="form-control ps-3" id="inEmp" name="DNIEmpleado"
                                        value={form.DNIEmpleado} onChange={handleChange} required placeholder="DNI Emp" />
                                    <label htmlFor="inEmp" style={labelStyle}>DNI Empleado</label>
                                </div>
                            </div>
                        </div>

                        {/* Fila 4: Reserva (Opcional) */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input type="number" className="form-control ps-3" id="inReserva" name="NroReserva"
                                        value={form.NroReserva} onChange={handleChange} placeholder="Reserva" />
                                    <label htmlFor="inReserva" style={labelStyle}>Nro. Reserva (Opcional)</label>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button type="button" className="btn btn-secondary px-4 btn-hover-scale btn-lighter-hover" onClick={Cancelar}>
                                <i className="fa-solid fa-times me-2"></i> Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary px-4 btn-hover-scale fw-bold text-white" style={{ backgroundColor: "#00aeff", borderColor: "#00aeff" }}>
                                <i className="fa-solid fa-save me-2"></i> {esEdicion ? "Guardar Cambios" : "Registrar Alquiler"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}