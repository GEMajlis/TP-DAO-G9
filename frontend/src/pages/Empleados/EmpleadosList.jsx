import React from "react";
import EmpleadosSearch from "./EmpleadosSearch";
import "../../styles/PageLayout.css";

// ----- 🔴 1. RECIBIMOS LA NUEVA PROP 'CambiarPagina' 🔴 -----
export default function EmpleadosList({
    Empleados,
    Modificar,
    Eliminar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    CambiarPagina, // <-- ¡NUEVA PROP!
    Volver, // (Lo agrego desde Page, por si lo usamos)

    // ¡Nuevas props de backend!
    FiltroDNI,
    setFiltroDNI,
    FiltroNombre,
    setFiltroNombre,
    BuscarPorDNI,
    BuscarPorNombre,
    Limpiar,
}) {
// -------------------------------------------------------
    return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
        <div className="card-body p-4">

        {/* TÍTULO (Sin cambios) */}
        <h4 className="mb-4 fw-semibold text-primary" style={{ display: "flex", alignItems: "center" }}>
            <i className="fa-solid fa-user-tie me-2"></i>Empleados
        </h4>

        {/* BARRA DE BÚSQUEDA (Sin cambios) */}
        <EmpleadosSearch
            DNI={FiltroDNI}
            setDNI={setFiltroDNI}
            Nombre={FiltroNombre}
            setNombre={setFiltroNombre}
            BuscarPorDNI={BuscarPorDNI}
            BuscarPorNombre={BuscarPorNombre}
            Limpiar={Limpiar}
        />
        {/* ----- FIN CAMBIO ----- */}

        {/* TABLA (Sin cambios) */}
        <div className="table-responsive">
            <table
            className="table table-sm table-hover align-middle"
            style={{ borderRadius: "10px", overflow: "hidden" }}
            >
            <thead className="table-primary text-center">
                <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th className="text-nowrap">Acciones</th>
                </tr>
            </thead>

            <tbody>
                {Empleados?.length > 0 ? (
                Empleados.map((empleado) => (
                    <tr key={empleado.DNI}>
                    <td className="fw-semibold text-center">{empleado.DNI}</td>
                    <td>{empleado.Nombre}</td>
                    <td>{empleado.Apellido}</td>
                    <td className="text-center text-nowrap">
                        {/* Modificar */}
                        <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => Modificar(empleado)}
                        >
                        <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        {/* Eliminar */}
                        <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => Eliminar(empleado)}
                        >
                        <i className="fa-solid fa-trash"></i>
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="4" className="text-center p-4">
                    <div className="alert alert-secondary mb-0">
                        No se encontraron empleados con esos criterios.
                    </div>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* FOOTER: PAGINACIÓN + BOTÓN */}
        <div className="d-flex justify-content-between align-items-center mt-3">

            {/* RegistrosTotal (Sin cambios, ahora muestra el total real) */}
            <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                Registros: {RegistrosTotal}
            </span>

            {/* ----- 🔴 2. PAGINADOR VUELVE A SER VISIBLE Y FUNCIONAL 🔴 ----- */}
            <div className="input-group input-group-sm" style={{ width: "150px" }}>
                <span className="input-group-text bg-light border">Página</span>
                <select
                    className="form-select"
                    value={Pagina} // <-- Controlado por paginaActual
                    disabled={false} // <-- Reactivado
                    onChange={(e) => CambiarPagina(e.target.value)} // <-- ¡CONECTADO!
                >
                    {Paginas?.map((x) => (
                    <option key={x} value={x}>{x}</option>
                    ))}
                </select>
            </div>
            {/* ----- -------------------------------------------- ----- */}

            {/* Botón Agregar */}
            <button
                // ----- 🔴 3. FIX: Faltaba la clase 'btn' 🔴 -----
                className="btn btn-primary"
                onClick={Agregar}
            >
                <i className="fa fa-plus me-2"></i>
                Nuevo Empleado
            </button>
        </div>
        </div>
    </div>
    );
}