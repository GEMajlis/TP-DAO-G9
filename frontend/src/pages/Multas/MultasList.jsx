import React from "react";
import MultasSearch from "./MultasSearch";

export default function MultasList({
    Multas,
    Modificar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    CambiarPagina,
    Buscar,
    Limpiar,
    FiltroAlquiler,
    setFiltroAlquiler,
}) {
    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">
                <h4 className="card-title mb-3 text-primary fw-bold">
                    <i className="fa-solid fa-ticket me-2"></i>
                    Listado de Multas
                </h4>

                <MultasSearch
                    Alquiler={FiltroAlquiler}
                    setAlquiler={setFiltroAlquiler}
                    Buscar={Buscar}
                    Limpiar={Limpiar}
                />

                <div className="table-responsive">
                    <table className={`table table-sm align-middle ${Multas?.length ? "table-hover" : ""}`}>
                        <thead className="table-primary text-center">
                            <tr>
                                <th>ID Multa</th>
                                <th>ID Alquiler</th>
                                <th>Motivo</th>
                                <th>Monto</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Multas?.length > 0 ? (
                                Multas.map((multa) => (
                                    <tr key={multa.id_multa}>
                                        <td className="text-center">{multa.id_multa}</td>
                                        <td className="text-center">{multa.alquiler?.id_alquiler}</td>
                                        <td>{multa.motivo}</td>
                                        <td className="text-center">${multa.monto}</td>
                                        <td className="text-center text-nowrap">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-1"
                                                onClick={() => Modificar(multa)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <span className="text-muted fst-italic">No se encontraron multas.</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="row mt-3 align-items-center text-center">
                    <div className="col-12 col-md-4 mb-md-0 d-flex justify-content-center justify-content-md-start">
                        <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                            Registros: {RegistrosTotal}
                        </span>
                    </div>

                    <div className="col-12 col-md-4 d-flex justify-content-center">
                        <div className="input-group input-group-sm" style={{ width: "150px" }}>
                            <span className="input-group-text bg-light border">Página</span>
                            <select
                                className="form-select"
                                value={Pagina}
                                onChange={(e) => CambiarPagina(e.target.value)}
                            >
                                {Paginas?.map((x) => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end">
                        <button className="btn-primary" onClick={Agregar}>
                            <i className="fa fa-plus me-2"></i>
                            Nueva Multa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
