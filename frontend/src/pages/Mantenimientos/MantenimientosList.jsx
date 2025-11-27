import React from "react";
import MantenimientosSearch from "./MantenimientosSearch";

export default function MantenimientosList({
    Mantenimientos,
    FiltroId,
    setFiltroId,
    BuscarPorId,
    CargarActivos,
    CargarTodos,
    Finalizar,
    Iniciar
}) {

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body p-4">

                <h4 className="card-title mb-3 text-primary fw-bold">
                    <i className="fa-solid fa-wrench me-2"></i>
                    Mantenimientos
                </h4>

                <MantenimientosSearch
                    FiltroId={FiltroId}
                    setFiltroId={setFiltroId}
                    BuscarPorId={BuscarPorId}
                    CargarActivos={CargarActivos}
                    CargarTodos={CargarTodos}
                />

                <div className="table-responsive mt-4">
                    <table className="table table-hover table-sm align-middle">
                        <thead className="table-primary text-center">
                            <tr>
                                <th>ID</th>
                                <th>DNI Empleado</th>
                                <th>Nombre</th>
                                <th>Patente</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Mantenimientos.length > 0 ? (
                                Mantenimientos.map((m) => (
                                    <tr key={m.id_mantenimiento}>
                                        <td>{m.id_mantenimiento}</td>
                                        <td>{m.dni_empleado}</td>
                                        <td>{m.empleado_nombre} {m.empleado_apellido}</td>
                                        <td>{m.patente}</td>
                                        <td>{m.fecha_inicio}</td>
                                        <td>{m.fecha_fin || "-"}</td>

                                        <td className="text-center">
                                            {!m.fecha_fin && (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => Finalizar(m.patente)}
                                                >
                                                    Finalizar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-muted">
                                        No hay mantenimientos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" onClick={Iniciar}>
                        <i className="fa fa-plus me-2" />
                        Iniciar Mantenimiento
                    </button>
                </div>

            </div>
        </div>
    );
}
