import React, { useState } from "react";

export default function EmpleadoForm({ Empleado, Guardar, Cancelar }) {
    const [form, setForm] = useState({
        DNI: Empleado?.DNI || "",
        Nombre: Empleado?.Nombre || "",
        Apellido: Empleado?.Apellido || "",
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
                            className={`fa-solid ${form.DNI ? "fa-pen-to-square" : "fa-plus"
                                } me-2`}
                        ></i>
                        {form.DNI ? "Modificar Empleado" : "Registrar Nuevo Empleado"}
                    </h4>
                    <p className="text-muted small mb-0 mt-1 ms-4">
                        Complete los datos del empleado a continuación.
                    </p>
                </div>

                {/* Cuerpo */}
                <div className="card-body p-4 pt-2">
                    <form onSubmit={handleSubmit}>
                        {/* Fila Única: DNI */}
                        <div className="row g-3 mb-3">
                            {/* Campo DNI (Ocupa 12 columnas) */}
                            <div className="col-md-12"> 
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-id-card"></i> 
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            className="form-control border-start-0 ps-2"
                                            id="inputDNI"
                                            name="DNI"
                                            placeholder="Ej: 30000000"
                                            value={form.DNI} // Usar DNI mayúscula si es la propiedad del estado
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputDni"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            DNI
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Fila Única: Nombre */}
                        <div className="row g-3 mb-4">
                            {/* Campo Nombre (Ocupa 12 columnas) */}
                            <div className="col-md-12"> 
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-user"></i> 
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-2"
                                            id="inputNombre"
                                            name="Nombre"
                                            placeholder="Ingrese su Nombre"
                                            value={form.Nombre}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputNombre"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Nombre
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fila Única: Apellido */}
                        <div className="row g-3 mb-4">
                            {/* Campo Apellido (Ocupa 12 columnas) */}
                            <div className="col-md-12"> 
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-secondary">
                                        <i className="fa-solid fa-user-tag"></i> 
                                    </span>
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-2"
                                            id="inputApellido"
                                            name="Apellido"
                                            placeholder="Ingrese su Apellido"
                                            value={form.Apellido}
                                            onChange={handleChange}
                                            required
                                            style={{ zIndex: 0 }}
                                        />
                                        <label
                                            htmlFor="inputApellido"
                                            style={labelStyle}
                                            className="ps-2"
                                        >
                                            Apellido
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
                                className="btn btn-primary px-4" // Agregué 'btn' y 'btn-primary' para estilo Bootstrap
                            >
                                <i className="fa-solid fa-save me-2"></i>
                                {form.DNI ? "Guardar Cambios" : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}