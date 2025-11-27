import React from "react";

export default function MantenimientosSearch({
    FiltroId,
    setFiltroId,
    BuscarPorId,
    CargarActivos,
    CargarTodos
}) {
    return (
        <div className="bg-light p-3 rounded-3 border">
            <div className="row g-3 align-items-center">

                <div className="col-md">
                    <label className="fw-bold text-secondary">ID Mantenimiento</label>
                    <input
                        type="number"
                        className="form-control"
                        value={FiltroId}
                        onChange={(e) => setFiltroId(e.target.value)}
                        placeholder="Buscar por ID..."
                    />
                </div>

                <div className="col-md-auto d-flex gap-2">
                    <button className="btn btn-primary fw-bold" onClick={BuscarPorId}>
                        Buscar
                    </button>

                    <button className="btn btn-success fw-bold" onClick={CargarActivos}>
                        Activos
                    </button>

                    <button className="btn btn-secondary fw-bold" onClick={CargarTodos}>
                        Todos
                    </button>
                </div>

            </div>
        </div>
    );
}
