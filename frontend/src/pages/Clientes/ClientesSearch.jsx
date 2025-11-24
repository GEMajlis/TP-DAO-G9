import React from "react";

// ----- INICIO CAMBIOS: Recibimos nuevas props (funciones) -----
export default function ClientesSearch({ 
    DNI, 
    setDNI, 
    Nombre, 
    setNombre, 
    // Se fue "Buscar" (la lupa)
    BuscarPorDNI,  // <-- Nueva
    BuscarPorNombre, // <-- Nueva
    Limpiar, // <-- Nueva
}) {
// ----- FIN CAMBIOS -----
  return (
    <form
      name="FormBusqueda"
      // ----- INICIO CAMBIOS: Sacamos el onSubmit -----
      onSubmit={(e) => {
        e.preventDefault();
        // No hacemos nada al presionar Enter, cada botón tiene su lógica
      }}
      // ----- FIN CAMBIOS -----
      className="bg-light p-3 rounded-3 border mb-4"
    >
      <div className="row align-items-center g-3">
        
        {/* ----- INICIO CAMBIOS: Grupo DNI con su propio botón ----- */}
        <div className="col-12 col-md-5 d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 text-center"
            style={{ minWidth: "100px" }}
          >
            Buscar DNI
          </label>
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setDNI(e.target.value)}
              value={DNI}
              placeholder="Ingrese DNI exacto..."
              maxLength="15"
              autoFocus
            />
            {/* Botón específico para buscar por DNI */}
            <button 
              className="btn btn-info fw-bold" 
              type="button" 
              onClick={BuscarPorDNI}
            >
              <i className="fa-solid fa-id-card"></i>
            </button>
          </div>
        </div>
        {/* ----- FIN CAMBIOS ----- */}

        {/* ----- INICIO CAMBIOS: Grupo Nombre con su propio botón ----- */}
        <div className="col-12 col-md-5 d-flex align-items-center">
          <label
            className="col-form-label fw-bold text-secondary me-2 ms-md-3 text-center"
            style={{ minWidth: "100px" }}
          >
            Buscar Nombre
          </label>
          <div className="input-group flex-grow-1">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setNombre(e.target.value)}
              value={Nombre}
              placeholder="Ingrese parte del nombre..."
              maxLength="55"
            />
            {/* Botón específico para buscar por Nombre */}
            <button 
              className="btn btn-success fw-bold" 
              type="button" 
              onClick={BuscarPorNombre}
            >
              <i className="fa-solid fa-user-check"></i>
            </button>
          </div>
        </div>
        {/* ----- FIN CAMBIOS ----- */}

        {/* ----- INICIO CAMBIOS: Botón Buscar reemplazado por Limpiar ----- */}
        <div className="col-12 col-md-2 text-center">
          <button
            type="button"
            className="btn btn-outline-secondary fw-bold px-3 w-100" // Botón Limpiar
            onClick={Limpiar} // Llama a la nueva función Limpiar
            title="Limpiar y Recargar Todos"
          >
            <i className="fa-solid fa-eraser"></i>
          </button>
        </div>
        {/* ----- FIN CAMBIOS ----- */}

      </div>
    </form>
  );
}