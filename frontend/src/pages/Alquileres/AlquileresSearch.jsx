import React from "react";

export default function AlquileresSearch({ IdAlquiler, setIdAlquiler, Estado, setEstado, Buscar }) {
    return (
        <form
            name="FormBusquedaAlquileres"
            onSubmit={(e) => {
                e.preventDefault();
                Buscar(1);
            }}
            className="bg-light p-3 rounded-3 border mb-4"
        >
            <div className="row align-items-center g-3">

                {/* ID Alquiler */}
                <div className="col-12 col-md d-flex align-items-center">
                    <label
                        className="col-form-label fw-bold text-secondary me-2 text-center"
                        style={{ minWidth: "100px" }}
                    >
                        ID Alquiler
                    </label>
                    <div className="input-group flex-grow-1">
                        <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setIdAlquiler(e.target.value)}
                            value={IdAlquiler}
                            placeholder="Ingrese ID..."
                            autoFocus
                        />
                    </div>
                </div>

                {/* Estado */}
                <div className="col-12 col-md d-flex align-items-center">
                    <label
                        className="col-form-label fw-bold text-secondary me-2 ms-md-3 text-center"
                        style={{ minWidth: "100px" }}
                    >
                        Estado
                    </label>
                    <select
                        className="form-select flex-grow-1"
                        onChange={(e) => setEstado(e.target.value)}
                        value={Estado}
                    >
                        <option value="">Todos</option>
                        <option value="Activo">Activo (En curso)</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>

                {/* Botón Buscar */}
                <div className="col-12 col-md-auto text-center">
                    <button
                        type="button"
                        className="btn-primary fw-bold px-3"
                        onClick={() => Buscar(1)}
                        title="Buscar"
                    >
                        <i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
        </form>
    );
}
