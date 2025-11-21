import React from "react";

export default function ReservasSearch({
  DNI,
  setDNI,
  Patente,
  setPatente,
  Estado,
  setEstado,
  Buscar,
}) {
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
        
        {/* --- Grupo DNI --- */}
        <div className="col-12 col-lg d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 text-center"
            style={{ minWidth: "80px" }} // Ancho mínimo reducido para que quepan
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

        {/* --- Grupo Patente --- */}
        <div className="col-12 col-lg d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 ms-lg-2 text-center"
            style={{ minWidth: "80px" }}
          >
            Patente
          </label>
          <input
            type="text"
            className="form-control flex-grow-1"
            onChange={(e) => setPatente(e.target.value)}
            value={Patente}
            placeholder="Ingrese patente..."
            maxLength="15"
          />
        </div>

        {/* --- Grupo Estado --- */}
        <div className="col-12 col-lg d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 ms-lg-2 text-center"
            style={{ minWidth: "80px" }}
          >
            Estado
          </label>
          <select
            className="form-select flex-grow-1"
            onChange={(e) => setEstado(e.target.value)}
            value={Estado}
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Activa">Activa</option>
            <option value="Finalizada">Finalizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {/* --- Botón Buscar --- */}
        <div className="col-12 col-lg-auto text-center">
          <button
            type="button"
            className="btn-primary fw-bold px-3 w-100 w-lg-auto mt-2 mt-lg-0" // Ancho completo en móvil, auto en desktop
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