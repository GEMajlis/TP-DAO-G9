import React from "react";
import VehiclesSearch from "./VehiculosSearch";

export default function VehiculosList({
    Vehiculos,
    Modificar,
    Eliminar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    Buscar,
    FiltroPatente,
    setFiltroPatente,
    FiltroEstado,
    setFiltroEstado,
}) {
    const getBadgeColor = (estado) => {
        switch (estado) {
            case "disponible": return "bg-success";
            case "alquilado": return "bg-warning text-dark";
            case "mantenimiento": return "bg-danger";
            default: return "bg-secondary";
        }
    };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                <h4 className="card-title mb-0 text-primary fw-bold mb-3">
                    <i className="fa-solid fa-car me-2"></i>
                    Flota de Vehículos
                </h4>

                <VehiclesSearch
                    Patente={FiltroPatente}
                    setPatente={setFiltroPatente}
                    Estado={FiltroEstado}
                    setEstado={setFiltroEstado}
                    Buscar={Buscar}
                />

                <div className="table-responsive">
                    <table
                        className={`table vehiculos-table table-sm align-middle ${Vehiculos?.length > 0 ? "table-hover" : ""}`}
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        <thead className="table-primary text-center">
                            <tr>
                                <th>Patente</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Color</th>
                                <th>Estado</th>
                                <th className="text-nowrap">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Vehiculos?.length > 0 ? (
                                Vehiculos.map((vehiculo) => (
                                    <tr key={vehiculo.patente}>
                                        <td className="text-center">{vehiculo.patente}</td>
                                        <td>{vehiculo.marca}</td>
                                        <td>{vehiculo.modelo}</td>
                                        <td className="text-center">{vehiculo.color}</td>
                                        <td className="text-center">
                                            <span className={`badge rounded-pill py-2 ${getBadgeColor(vehiculo.estado)}`}>
                                                {vehiculo.estado}
                                            </span>
                                        </td>
                                        <td className="text-center text-nowrap">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-1"
                                                onClick={() => Modificar(vehiculo)}
                                                title="Modificar"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => Eliminar(vehiculo)}
                                                title="Eliminar"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 border-0">
                                        <span className="text-muted fs-6 fst-italic">
                                            No se encontraron vehículos con esos criterios.
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="row mt-3 align-items-center text-center">

                    <div className="col-12 col-md-4 mb-2 mb-md-0 d-flex justify-content-md-start justify-content-center">
                        <span className="badge bg-light text-dark border px-3 py-2 fs-6 tabla-registros">
                            Registros: {RegistrosTotal}
                        </span>
                    </div>

                    <div className="col-12 col-md-4 mb-2 mb-md-0 d-flex justify-content-center">
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
                    </div>

                    <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center">
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
        </div>
    );
}