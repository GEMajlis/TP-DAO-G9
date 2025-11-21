import React from "react";

export default function EmpleadosSearch({ DNI, setDNI, Nombre, setNombre, Buscar }) {
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
        
        {/* Grupo DNI */}
        <div className="col-12 col-md d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 text-center"
            style={{ minWidth: "100px" }}
          >
            DNI
          </label>
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDNI(e.target.value)}
              value={DNI}
              placeholder="Ingrese DNI..."
              maxLength="15"
              autoFocus
            />
          </div>
        </div>

        {/* Grupo Nombre */}
        <div className="col-12 col-md d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 ms-md-3 text-center"
            style={{ minWidth: "100px" }}
          >
            Nombre
          </label>
          <input
            type="text"
            className="form-control flex-grow-1"
            onChange={(e) => setNombre(e.target.value)}
            value={Nombre}
            placeholder="Ingrese nombre..."
            maxLength="55"
          />
        </div>

        {/* Botón Buscar */}
        <div className="col-12 col-md-auto text-center">
          <button
            type="button"
            className="btn-primary fw-bold px-3" // O "btn btn-primary"
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