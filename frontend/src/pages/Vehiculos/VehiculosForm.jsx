import React, { useState } from "react";

export default function VehiculosForm({ Vehiculo, Guardar, Cancelar }) {
    const esEdicion = !!Vehiculo;

    const [form, setForm] = useState({
        Patente: Vehiculo?.Patente || "",
        Color: Vehiculo?.Color || "",
        Marca: Vehiculo?.Marca || "",
        Modelo: Vehiculo?.Modelo || "",
        Estado: Vehiculo?.Estado || "Disponible", 
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
            <div
                className="card shadow-lg border-0 w-100 formulario-container"
                style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "12px" }}
            >
                <div className="card-header bg-white border-bottom-0 pt-3 pb-1" style={{ borderRadius: "12px" }}>
                    <h4 className="card-title mb-0 text-primary fw-bold">
                        <i
                            className={`fa-solid ${esEdicion ? "fa-pen-to-square" : "fa-plus"} me-2`}
                        ></i>
                        {esEdicion ? "Modificar Vehículo" : "Registrar Nuevo Vehículo"}
                    </h4>
                    <p className="text-muted small mb-0 mt-1 ms-4">
                        Complete los datos del vehículo a continuación:
                    </p>
                </div>

                <div className="card-body p-4 pt-2">
                    <form onSubmit={handleSubmit}>

                        {/* Fila 1: Patente y Color */}
                        <div className="row g-3 mb-3">
                            {/* Patente */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-barcode"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className={`form-control border-start-0 ps-2 ${esEdicion ? "bg-light" : ""}`}
                                            id="inputPatente"
                                            name="Patente"
                                            placeholder="Ej: AA123BB"
                                            value={form.Patente}
                                            onChange={handleChange}
                                            required
                                            autoFocus={!esEdicion}
                                            readOnly={esEdicion}
                                            style={{ zIndex: 0 }}
                                        />
                                        <label htmlFor="inputPatente" style={labelStyle} className="ps-2">
                                            Patente
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Color */}
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-palette"></i>
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-2"
                                            id="inputColor"
                                            name="Color"
                                            placeholder="Ej: Rojo"
                                            value={form.Color}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label htmlFor="inputColor" style={labelStyle} className="ps-2">
                                            Color
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fila 2: Marca y Modelo */}
                        <div className="row g-3 mb-4">
                            {/* Marca */}
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
                                        <label htmlFor="inputMarca" style={labelStyle} className="ps-2">
                                            Marca
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modelo */}
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
                                        <label htmlFor="inputModelo" style={labelStyle} className="ps-2">
                                            Modelo
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
                            >
                                <i className="fa-solid fa-times me-2"></i>
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn-primary px-4 fw-bold"
                            >
                                <i className="fa-solid fa-save me-2"></i>
                                {esEdicion ? "Guardar" : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}