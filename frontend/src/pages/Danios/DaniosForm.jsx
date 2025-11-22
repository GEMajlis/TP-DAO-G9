import React, { useState } from "react";

export default function DaniosForm({ Danio, Guardar, Cancelar }) {
    const esEdicion = !!Danio;

    const [form, setForm] = useState({
        IdDanio: Danio?.IdDanio || "",
        IdAlquiler: Danio?.IdAlquiler || "",
        Descripcion: Danio?.Descripcion || "",
        Monto: Danio?.Monto || "",
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
        <div
            className="card shadow-lg border-0 w-100 formulario-container"
            style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "12px" }}
        >
            <div className="card-header bg-white border-bottom-0 pt-3 pb-1">
                <h4 className="card-title mb-0 text-primary fw-bold">
                    <i className={`fa-solid ${esEdicion ? "fa-pen-to-square" : "fa-plus"} me-2`}></i>
                    {esEdicion ? "Modificar Daño" : "Registrar Nuevo Daño"}
                </h4>
                <p className="text-muted small mb-0 mt-1 ms-4">
                    Complete los datos del daño a continuación:
                </p>
            </div>

            <div className="card-body p-4 pt-2">
                <form onSubmit={handleSubmit}>
                    {/* Fila: IdAlquiler + Monto */}
                    <div className="row g-3 mb-3">
                        {/* IdAlquiler */}
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-receipt"></i>
                                </span>

                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control border-start-0 ps-2"
                                        id="inputIdAlquiler"
                                        name="IdAlquiler"
                                        placeholder="ID del alquiler"
                                        value={form.IdAlquiler}
                                        onChange={handleChange}
                                        required
                                        style={{ zIndex: 0 }}
                                    />
                                    <label htmlFor="inputIdAlquiler" style={labelStyle} className="ps-2">
                                        ID del Alquiler
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Monto */}
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light text-secondary">
                                    <i className="fa-solid fa-dollar-sign"></i>
                                </span>

                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control border-start-0 ps-2"
                                        id="inputMonto"
                                        name="Monto"
                                        placeholder="Monto"
                                        value={form.Monto}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        style={{ zIndex: 0 }}
                                    />
                                    <label htmlFor="inputMonto" style={labelStyle} className="ps-2">
                                        Monto
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="mb-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light text-secondary">
                                <i className="fa-solid fa-align-left"></i>
                            </span>

                            <div className="form-floating">
                                <textarea
                                    className="form-control border-start-0 ps-2"
                                    id="inputDescripcion"
                                    name="Descripcion"
                                    placeholder="Descripción del daño"
                                    style={{ height: "120px", zIndex: 0 }}
                                    value={form.Descripcion}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <label htmlFor="inputDescripcion" style={labelStyle} className="ps-2">
                                    Descripción
                                </label>
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

                        <button type="submit" className="btn-primary px-4 fw-bold">
                            <i className="fa-solid fa-save me-2"></i>
                            {esEdicion ? "Guardar" : "Registrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
