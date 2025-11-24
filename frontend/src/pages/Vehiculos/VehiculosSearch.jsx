import React from "react";

export default function VehiclesSearch({ Patente, setPatente, Estado, setEstado, Buscar }) {
  return (
    <form
      name="FormBusqueda"
      onSubmit={(e) => {
        e.preventDefault();
      }}
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
              onChange={(e) => setPatente(e.target.value)}
              value={Patente}
              placeholder="Ingrese patente..."
              maxLength="55"
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
            <option value="disponible">Disponible</option>
            <option value="alquilado">Alquilado</option>
            <option value="mantenimiento">En Mantenimiento</option>
          </select>
        </div>

      </div>
    </form>
  );
}