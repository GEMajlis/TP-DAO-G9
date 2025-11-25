import React from "react";

export default function AlquileresSearch({ Patente, setPatente, Estado, setEstado, Buscar }) {
    // Función auxiliar para actualizar el filtro y disparar la búsqueda
    const handlePatenteChange = (value) => {
        setPatente(value);
        Buscar(1); // búsqueda automática
    };

    const handleEstadoChange = (value) => {
        setEstado(value);
        Buscar(1); // búsqueda automática
    };

    return (
        <form
            name="FormBusquedaAlquileres"
            onSubmit={(e) => e.preventDefault()} // ya no necesitamos botón Buscar
            className="bg-light p-3 rounded-3 border mb-4"
        >
            <div className="row align-items-center g-3">

                {/* Patente */}
                <div className="col-12 col-md d-flex align-items-center">
                    <label
                        className="col-form-label fw-bold text-secondary me-2 text-center"
                        style={{ minWidth: "100px" }}
                    >
                        Patente
                    </label>
                    <div className="input-group flex-grow-1">
                        <input
                            type="text"
                            className="form-control"
                            onChange={(e) => handlePatenteChange(e.target.value)}
                            value={Patente}
                            placeholder="Ingrese patente..."
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
                        onChange={(e) => handleEstadoChange(e.target.value)}
                        value={Estado}
                    >
                        <option value="">Todos</option>
                        <option value="Activo">En curso</option>
                        <option value="Finalizado">Finalizado</option>
                    </select>
                </div>

            </div>
        </form>
    );
}
