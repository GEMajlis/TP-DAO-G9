import React from "react";
import AlquileresSearch from "./AlquileresSearch";

export default function AlquileresList({
  Alquileres,
  Finalizar,
  Agregar,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar,
  FiltroEstado,
  setFiltroEstado,
  FiltroPatente,
  setFiltroPatente
}) {
  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
      <div className="card-body p-4">

        {/* TÍTULO */}
        <h4 className="card-title mb-0 text-primary fw-bold mb-3">
          <i className="fa-solid fa-file-contract me-2"></i>Listado de Alquileres
        </h4>

        {/* BUSCADOR */}
        <AlquileresSearch
          Patente={FiltroPatente}
          setPatente={setFiltroPatente}
          Estado={FiltroEstado}
          setEstado={setFiltroEstado}
          Buscar={Buscar}
        />

        {/* TABLA */}
        <div className="table-responsive ">
          <table
            className={`table table-sm align-middle alquileres-table ${Alquileres?.length > 0 ? "table-hover" : ""
              }`}
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <thead className="table-primary text-center">
              <tr>
                <th>Vehículo</th>
                <th>Cliente</th>
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
                  <tr key={alquiler.id}>
                    <td className="text-center">{alquiler.vehiculo_patente}</td>
                    <td className="text-center">{alquiler.cliente_nombre}</td>
                    <td className="text-center">
                      {alquiler.fecha_inicio ? new Date(alquiler.fecha_inicio).toLocaleDateString("es-AR") : "-"}
                    </td>
                    <td className="text-center">
                      {alquiler.fecha_fin ? new Date(alquiler.fecha_fin).toLocaleDateString("es-AR") : "-"}
                    </td>
                    <td className="text-center">
                      {alquiler.total_pago ? `$${alquiler.total_pago}` : "-"}
                    </td>
                    <td className="text-center">{alquiler.empleado_nombre}</td>
                    <td className="text-center">{alquiler.reserva_id || "-"}</td>

                    <td className="text-center text-nowrap">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => Finalizar(alquiler)}
                        title="Finalizar"
                        disabled={!alquiler.activo}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5 border-0">
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
              Nuevo Alquiler
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
