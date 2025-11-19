import React from "react";

export default function VehiclesSearch({ Patente, setPatente, Activo, setActivo, Buscar }) {
    return (
        <form
            name="FormBusqueda"
            onSubmit={(e) => {
                e.preventDefault();
                Buscar(1);
            }}
            className="bg-light p-3 rounded-3 border mb-4"
        >
            <div className="row align-items-center g-3">

                {/* Grupo Patente */}
                <div className="col-12 col-md d-flex align-items-center">
                    <label
                        className="col-form-label fw-bold text-secondary me-2"
                        style={{ minWidth: "100px" }}
                    >
                        Patente
                    </label>
                    <div className="input-group flex-grow-1">
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) => setPatente(e.target.value)}
                            value={Patente}
                            placeholder="Ingrese patente..."
                            maxLength="55"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Grupo Estado */}
                <div className="col-12 col-md d-flex align-items-center">
                    <label
                        className="col-form-label fw-bold text-secondary me-2 ms-md-3"
                        style={{ minWidth: "100px" }}
                    >
                        Estado
                    </label>
                    <select
                        className="form-select flex-grow-1"
                        onChange={(e) => setActivo(e.target.value)}
                        value={Activo}
                    >
                        <option value="">Todos</option>
                        <option value="true">Disponible</option>
                        <option value="false">No Disponible</option>
                    </select>
                </div>

                {/* Botón Buscar */}
                <div className="col-auto">
                    <button
                        type="button"
                        className="btn-primary fw-bold px-4"
                        onClick={() => Buscar(1)}
                    >
                        <i className="fa fa-search me-2"></i> Buscar
                    </button>
                </div>
            </div>
        </form>
    );
}