import React from "react";

// ----- INICIO CAMBIOS: Se eliminan props de filtros locales -----
export default function ReservasSearch({
  ID,
  setID,
  BuscarPorID,
  BuscarDelDia,
  Limpiar,
}) {
// ----- FIN CAMBIOS -----
  return (
    <form
      name="FormBusqueda"
      onSubmit={(e) => e.preventDefault()}
      className="bg-light p-3 rounded-3 border mb-4"
    >
      {/* ----- INICIO CAMBIOS: Reorganizamos la fila ----- */}
      <div className="row g-3 align-items-end">
        {/* --- Grupo Búsqueda por ID --- */}
        <div className="col-12 col-lg-5">
          <label className="col-form-label fw-bold text-secondary">
            Búsqueda Específica por ID
          </label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              placeholder="Ingrese N° de Reserva..."
              onChange={(e) => setID(e.target.value)}
              value={ID}
            />
            <button
              type="button"
              className="btn btn-info fw-bold"
              onClick={BuscarPorID}
              title="Buscar por ID"
            >
              <i className="fa-solid fa-ticket me-2"></i>
              Buscar ID
            </button>
          </div>
        </div>

        {/* --- Grupo Búsqueda del Día --- */}
        <div className="col-12 col-lg-4">
          <button
            type="button"
            className="btn btn-success fw-bold w-100"
            onClick={BuscarDelDia}
            title="Buscar Reservas del Día"
          >
            <i className="fa-solid fa-sun me-2"></i>
            Ver Reservas del Día
          </button>
        </div>

        {/* --- Botón Limpiar --- */}
        <div className="col-12 col-lg-3">
          <button
            type="button"
            className="btn btn-outline-secondary fw-bold w-100"
            onClick={Limpiar}
            title="Limpiar búsqueda y recargar todo"
          >
            <i className="fa-solid fa-eraser me-2"></i>
            Limpiar
          </button>
        </div>
      </div>
      {/* ----- FIN CAMBIOS ----- */}

      {/* ----- INICIO CAMBIOS: Se elimina toda la fila de filtros locales ----- */}
      {/* ... (Toda la fila de DNI, Patente, Estado y Lupa se fue) ... */}
      {/* ----- FIN CAMBIOS ----- */}
    </form>
  );
}