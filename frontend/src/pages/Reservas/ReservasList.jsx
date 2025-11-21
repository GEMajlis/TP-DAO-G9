import React from "react";
import ReservasSearch from "./ReservasSearch"; // <-- CAMBIO: Importado

export default function ReservasList({
    Reservas,
    Modificar,
    Cancelar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    Buscar,
    // ----- INICIO CAMBIOS: Props nuevas -----
    FiltroDNI,
    setFiltroDNI,
    FiltroPatente,
    setFiltroPatente,
    FiltroEstado,
    setFiltroEstado,
    // ----- FIN CAMBIOS -----
}) {
    return (
        
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                {/* TÍTULO */}
                <h4 className="mb-4 fw-semibold text-primary" style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa-solid fa-calendar-check me-2"></i>Reservas {/* CAMBIO: Icono */}
                </h4>

                {/* ----- INICIO CAMBIO: Barra de Búsqueda ----- */}
                <ReservasSearch
                    DNI={FiltroDNI}
                    setDNI={setFiltroDNI}
                    Patente={FiltroPatente}
                    setPatente={setFiltroPatente}
                    Estado={FiltroEstado}
                    setEstado={setFiltroEstado}
                    Buscar={Buscar}
                />
                {/* ----- FIN CAMBIO ----- */}


                {/* TABLA */}
                <div className="table-responsive">
                    <table
                        className="table table-sm table-hover align-middle"
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        <thead className="table-primary text-center">
                            <tr>
                                <th>Id</th>
                                <th>DNI Cliente</th>
                                <th>Patente</th>
                                <th>Fecha de Inicio</th>
                                <th>Fecha de Fin</th>
                                <th>Estado</th>
                                <th className="text-nowrap">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Reservas?.length > 0 ? (
                                Reservas.map((reserva) => (
                                    <tr key={reserva.IdReserva}>
                                        <td className="fw-semibold text-center">{reserva.IdReserva}</td>
                                        <td>{reserva.DNICliente}</td>
                                        <td>{reserva.Patente}</td>
                                        <td className="text-center">{reserva.FechaInicio}</td>
                                        <td className="text-center">{reserva.FechaFin}</td>
                                        <td className="text-center">
                                            {(() => {
                                                // 1. Definimos las variables
                                                let claseDeBadge = "";
                                                const textoDelEstado = reserva.Estado;

                                                // 2. Asignamos la clase de Bootstrap según el texto del estado
                                                switch (reserva.Estado) {
                                                    case "Exitosa":
                                                        claseDeBadge = "bg-success"; // Verde
                                                        break;
                                                    case "Activa":
                                                        claseDeBadge = "bg-warning"; // Amarillo
                                                        break;
                                                    case "Fallida":
                                                        claseDeBadge = "bg-dark";   // Negro
                                                        break;
                                                    case "Cancelada":
                                                        claseDeBadge = "bg-danger";  // Rojo
                                                        break;
                                                    default:
                                                        // Un color por defecto si el estado no es ninguno de los esperados
                                                        claseDeBadge = "bg-secondary";
                                                }

                                                // 3. Devolvemos el <span> con la clase y el texto correctos
                                                return (
                                                <span className={`badge rounded-pill ${claseDeBadge} px-3 py-2`}>
                                                    {textoDelEstado}
                                                </span>
                                                );
                                            })()}
                                            </td>
                                        
                                        <td className="text-center text-nowrap">
                                            {/* Modificar */}
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-1"
                                                onClick={() => Modificar(reserva)}
                                                title="Modificar"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>

                                            {/* Cancelar*/}
                                            {reserva.Estado === "Activa" && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger me-1" 
                                                    onClick={() => Cancelar(reserva)}
                                                    title="Cancelar Reserva"
                                                >
                                                    <i className="fa-solid fa-ban"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-4">
                                        <div className="alert alert-secondary mb-0">
                                            {/* CAMBIO: Texto actualizado */}
                                            No se encontraron reservas con esos criterios.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER: PAGINACIÓN + BOTÓN */}
                <div className="d-flex justify-content-between align-items-center mt-3">

                    <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                        Registros: {RegistrosTotal}
                    </span>

                    {/* Paginador */}
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

                    {/* Botón Agregar */}
                    <button
                        className="btn-primary"
                        onClick={Agregar}
                    >
                        <i className="fa fa-plus me-2"></i>
                        Nueva Reserva
                    </button>
                </div>
            </div>
        </div>
    );
}