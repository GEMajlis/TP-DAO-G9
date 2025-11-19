import React from "react";
import VehiclesSearch from "./VehiculosSearch"; // <--- Importamos el buscador

export default function VehiculosList({
    Vehiculos,
    Modificar,
    ActivarDesactivar,
    Eliminar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    Buscar,
    // Props nuevas para el filtro
    FiltroPatente,
    setFiltroPatente,
    FiltroActivo,
    setFiltroActivo,
}) {
    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                {/* --- BUSCADOR INTEGRADO --- */}
                <VehiclesSearch
                    Patente={FiltroPatente}
                    setPatente={setFiltroPatente}
                    Activo={FiltroActivo}
                    setActivo={setFiltroActivo}
                    Buscar={Buscar}
                />
                <hr />
                {/* -------------------------- */}

                {/* TÍTULO */}
                <h4 className="mb-4 fw-semibold text-primary" style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa-solid fa-car me-2"></i>
                    Flota de Vehículos
                </h4>

                {/* TABLA */}
                <div className="table-responsive">
                    <table
                        className="table table-sm table-hover align-middle"
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        <thead className="table-primary text-center">
                            <tr>
                                <th>Patente</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>Estado</th>
                                <th className="text-nowrap">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Vehiculos?.length > 0 ? (
                                Vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.IdVehiculo || vehiculo.Patente}>
                                        <td className="fw-semibold text-center">{vehiculo.Patente}</td>
                                        <td>{vehiculo.Marca}</td>
                                        <td>{vehiculo.Modelo}</td>
                                        <td className="text-center">{vehiculo.Anio}</td>
                                        <td className="text-center">
                                            {vehiculo.Activo ? (
                                                <span className="badge rounded-pill bg-success px-3 py-2">
                                                    Activo
                                                </span>
                                            ) : (
                                                <span className="badge rounded-pill bg-danger px-3 py-2">
                                                    Inactivo
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center text-nowrap">
                                            {/* Modificar */}
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-1"
                                                onClick={() => Modificar(vehiculo)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>

                                            {/* Activar / Desactivar */}
                                            <button
                                                className={
                                                    "btn btn-sm me-1 " +
                                                    (vehiculo.Activo
                                                        ? "btn-outline-warning"
                                                        : "btn-outline-success")
                                                }
                                                onClick={() => ActivarDesactivar(vehiculo)}
                                            >
                                                <i className={"fa fa-" + (vehiculo.Activo ? "ban" : "check")}></i>
                                            </button>

                                            {/* Eliminar */}
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => Eliminar(vehiculo)}
                                                disabled={vehiculo.Activo}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4">
                                        <div className="alert alert-secondary mb-0">
                                            No se encontraron vehículos con esos criterios.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER: PAGINACIÓN + BOTÓN */}
                <div className="d-flex justify-content-between align-items-center mt-3">

                    <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                        Registros: {RegistrosTotal}
                    </span>

                    {/* Paginador */}
                    <div className="input-group input-group-sm" style={{ width: "150px" }}>
                        <span className="input-group-text bg-light border">Página</span>
                        <select
                            className="form-select"
                            value={Pagina}
                            onChange={(e) => Buscar(e.target.value)}
                        >
                            {Paginas?.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón Agregar */}
                    <button
                        className="btn-primary"
                        onClick={Agregar}
                    >
                        <i className="fa fa-plus me-2"></i>
                        Nuevo Vehículo
                    </button>
                </div>
            </div>
        </div>
    );
}