import React from "react";
import AlquileresSearch from "./AlquileresSearch";

export default function AlquileresList({
  Alquileres,
  Modificar,
  Eliminar,
  Agregar,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar,
  FiltroPatente,
  setFiltroPatente,
  FiltroDNI,
  setFiltroDNI,
  Volver
}) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
      <div className="card-body p-4">

        {/* TÍTULO */}
        <h4 className="mb-4 fw-semibold text-primary" style={{ display: "flex", alignItems: "center" }}>
          <i className="fa-solid fa-file-contract me-2"></i>
          Listado de Alquileres
        </h4>

        {/* BUSCADOR INTEGRADO */}
        {/* Ahora que AlquileresSearch existe, esta importación funcionará */}
        <AlquileresSearch
          Patente={FiltroPatente}
          setPatente={setFiltroPatente}
          DNI={FiltroDNI}
          setDNI={setFiltroDNI}
          Buscar={Buscar}
        />

        {/* TABLA */}
        <div className="table-responsive">
          <table
            className={`table table-sm align-middle ${Alquileres?.length > 0 ? "table-hover" : ""}`}
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <thead className="table-primary text-center">
              <tr>
                <th>Patente</th>
                <th>Cliente (DNI)</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Costo</th>
                <th>Empleado</th>
                <th>Reserva</th>
                <th className="text-nowrap">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {Alquileres?.length > 0 ? (
                Alquileres.map((alquiler) => (
                  <tr key={alquiler.IdAlquiler}>
                    <td className="fw-semibold text-center text-primary">
                      {alquiler.Patente}
                    </td>
                    <td className="text-center">{alquiler.DNICliente}</td>
                    <td className="text-center">{alquiler.FechaInicio}</td>
                    <td className="text-center">{alquiler.FechaFin}</td>
                    <td className="text-center fw-bold text-success">
                      ${alquiler.Costo}
                    </td>
                    <td className="text-center">{alquiler.DNIEmpleado}</td>
                    <td className="text-center">
                      {alquiler.NroReserva ? (
                        <span className="badge bg-info text-dark">
                          #{alquiler.NroReserva}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    <td className="text-center text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => Modificar(alquiler)}
                        title="Modificar"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => Eliminar(alquiler)}
                        title="Eliminar"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5 border-0">
                    <span className="text-muted fs-6 fst-italic">
                      No se encontraron alquileres registrados.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="badge bg-light text-dark border px-3 py-2 fs-6">
            Registros: {RegistrosTotal}
          </span>

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

          <button
            className="btn-primary"
            onClick={Agregar}
          >
            <i className="fa fa-plus me-2"></i>
            Nuevo Alquiler
          </button>
        </div>
      </div>
    </div>
  );
}