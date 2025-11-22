import React from "react";
export default function DaniosList({
  Danios,
  Modificar,
  Eliminar,
  Agregar,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar
}) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
      <div className="card-body p-4">

        <h4 className="card-title mb-0 text-primary fw-bold mb-3">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>
          Listado de Daños
        </h4>

        <div className="table-responsive">
          <table
            className={`table table-sm align-middle ${Danios?.length > 0 ? "table-hover" : ""}`}
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <thead className="table-primary text-center">
              <tr>
                <th>Alquiler</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th className="text-nowrap">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {Danios?.length > 0 ? (
                Danios.map((danio) => (
                  <tr key={danio.IdDanio}>
                    <td className="text-center">{danio.IdAlquiler}</td>
                    <td className="text-center">{danio.Descripcion}</td>
                    <td className="text-center">
                      ${Number(danio.Monto).toLocaleString()}
                    </td>
                    <td className="text-center text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => Modificar(danio)}
                        title="Modificar"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => Eliminar(danio)}
                        title="Eliminar"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 border-0">
                    <span className="text-muted fs-6 fst-italic">
                      No hay daños registrados.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="row mt-3 align-items-center text-center">

          <div className="col-12 col-md-4 mb-2 mb-md-0 d-flex justify-content-md-start justify-content-center">
            <span className="badge bg-light text-dark border px-3 py-2 fs-6 tabla-registros">
              Registros: {RegistrosTotal}
            </span>
          </div>

          <div className="col-12 col-md-4 mb-2 mb-md-0 d-flex justify-content-center">
            <div className="input-group input-group-sm" style={{ width: "150px" }}>
              <span className="input-group-text bg-light border">Página</span>
              <select
                className="form-select"
                value={Pagina}
                onChange={(e) => Buscar(e.target.value)}
              >
                {Paginas?.map((x) => (
                  <option key={x} value={x}>{x}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center">
            <button
              className="btn-primary"
              onClick={Agregar}
            >
              <i className="fa fa-plus me-2"></i>
              Nuevo Daño
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
