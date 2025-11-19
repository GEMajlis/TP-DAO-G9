import React, { useState } from "react";

export default function VehiculosForm({ Vehiculo, Guardar, Cancelar }) {
    const [form, setForm] = useState({
        IdVehiculo: Vehiculo?.IdVehiculo || null,
        Patente: Vehiculo?.Patente || "",
        Marca: Vehiculo?.Marca || "",
        Modelo: Vehiculo?.Modelo || "",
        Anio: Vehiculo?.Anio || "",
        Activo: Vehiculo?.Activo ?? true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Guardar(form);
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
                            className={`fa-solid ${form.IdVehiculo ? "fa-pen-to-square" : "fa-plus"
                                } me-2`}
                        ></i>
                        {form.IdVehiculo ? "Modificar Vehículo" : "Registrar Nuevo Vehículo"}
                    </h4>
                    <p className="text-muted small mb-0 mt-1 ms-4">
                        Complete los datos del vehículo a continuación.
                    </p>
                </div>

                {/* Cuerpo */}
                <div className="card-body p-4 pt-2">
                    <form onSubmit={handleSubmit}>
                        {/* Fila 1: Patente y Año */}
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-barcode"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-2"
                                            id="inputPatente"
                                            name="Patente"
                                            placeholder="Ej: AA123BB"
                                            value={form.Patente}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputPatente"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Patente
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-calendar-days"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            className="form-control border-start-0 ps-2"
                                            id="inputAnio"
                                            name="Anio"
                                            placeholder="Ej: 2024"
                                            min="1900"
                                            max="2100"
                                            value={form.Anio}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputAnio"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Año
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fila 2: Marca y Modelo */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-tag"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-2"
                                            id="inputMarca"
                                            name="Marca"
                                            placeholder="Marca"
                                            value={form.Marca}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputMarca"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Marca
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-car"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-2"
                                            id="inputModelo"
                                            name="Modelo"
                                            placeholder="Modelo"
                                            value={form.Modelo}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputModelo"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Modelo
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Estado (Switch) */}
                        <div className="d-flex align-items-center bg-light p-3 rounded-3 border mb-4">
                            <div className="form-check form-switch ms-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="Activo"
                                    id="activoSwitch"
                                    checked={form.Activo}
                                    onChange={handleChange}
                                    style={{ cursor: "pointer", width: "3em", height: "1.5em" }}
                                />
                                <label
                                    className="form-check-label ms-3 fw-bold text-secondary"
                                    htmlFor="activoSwitch"
                                    style={{ cursor: "pointer", paddingTop: "2px" }}
                                >
                                    {form.Activo ? (
                                        <span className="text-success">
                                            <i className="fa-solid fa-check-circle me-1"></i> Vehículo
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="text-danger">
                                            <i className="fa-solid fa-ban me-1"></i> Vehículo Inactivo
                                        </span>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                            <button
                                type="button"
                                className="btn btn-secondary px-4 fw-bold"
                                onClick={Cancelar}
                            >
                                <i className="fa-solid fa-times me-2"></i>
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn-primary px-4"
                            >
                                <i className="fa-solid fa-save me-2"></i>
                                {form.IdVehiculo ? "Guardar Cambios" : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}