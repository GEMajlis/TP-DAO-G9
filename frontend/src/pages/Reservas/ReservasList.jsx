import React from "react";
import ReservasSearch from "./ReservasSearch"; 

// ----- 🔴 1. RECIBIMOS LA NUEVA PROP 'CambiarPagina' 🔴 -----
export default function ReservasList({
    Reservas,
    Modificar,
    Cancelar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    CambiarPagina, // <-- NUEVA PROP
    Volver, // <-- (La tenías en Page pero no acá, la agrego por si acaso)

    // Props de Búsqueda Backend
    FiltroID,
    setFiltroID,
    BuscarPorID,
    BuscarDelDia,
    Limpiar,
}) {
// -------------------------------------------------------
    return (
        
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                <h4 className="mb-4 fw-semibold text-primary" style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa-solid fa-calendar-check me-2"></i>Reservas
                </h4>

                {/* BARRA DE BÚSQUEDA (Sin cambios) */}
                <ReservasSearch
                    ID={FiltroID}
                    setID={setFiltroID}
                    BuscarPorID={BuscarPorID}
                    BuscarDelDia={BuscarDelDia}
                    Limpiar={Limpiar}
                />


                {/* TABLA (Sin cambios) */}
                <div className="table-responsive">
                    <table
                        className="table table-sm table-hover align-middle"
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        <thead className="table-primary text-center">
                            <tr>
                                <th>Id</th>
                                <th>DNI Cliente</th>
                                <th style={{ textAlign: "left" }}>Nombre Cliente</th>
                                <th>Patente</th>
                                <th style={{ textAlign: "left" }}>Vehículo</th>
                                <th>Fecha Reserva</th>
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
                                        <td>{reserva.ClienteNombre}</td> 
                                        <td>{reserva.Patente}</td>
                                        <td>{reserva.VehiculoModelo}</td>
                                        {/* (El .split('T')[0] de la fecha se queda) */}
                                        <td className="text-center">{reserva.FechaReserva.split('T')[0]}</td>
                                        <td className="text-center">{reserva.FechaInicio}</td>
                                        <td className="text-center">{reserva.FechaFin}</td>
                                        <td className="text-center">
                                            {(() => {
                                                let claseDeBadge = "";
                                                const textoDelEstado = reserva.Estado.charAt(0).toUpperCase() + reserva.Estado.slice(1);

                                                // (El switch de colores se queda igual)
                                                switch (reserva.Estado) {
                                                    case "completada": claseDeBadge = "bg-success"; break;
                                                    case "confirmada": claseDeBadge = "bg-primary"; break;
                                                    case "pendiente": claseDeBadge = "bg-warning"; break;
                                                    case "cancelada":
                                                    case "cancelado": claseDeBadge = "bg-danger"; break;
                                                    case "expirada": claseDeBadge = "bg-dark"; break;
                                                    default: claseDeBadge = "bg-secondary";
                                                }

                                                return (
                                                <span className={`badge rounded-pill ${claseDeBadge} px-3 py-2`}>
                                                    {textoDelEstado}
                                                </span>
                                                );
                                            })()}
                                            </td>
                                        
                                        <td className="text-center text-nowrap">
                                            {/* Modificar - Solo disponible para reservas pendientes */}
                                            {reserva.Estado === "pendiente" && (
                                                <button
                                                    className="btn btn-sm btn-outline-secondary me-1"
                                                    onClick={() => Modificar(reserva)}
                                                    title="Modificar"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            )}

                                            {/* Cancelar */}
                                            {(reserva.Estado === "pendiente" || reserva.Estado === "confirmado") && (
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
                                    <td colSpan="10" className="text-center p-4">
                                        <div className="alert alert-secondary mb-0">
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
                        {/* 🔴 2. 'RegistrosTotal' AHORA MUESTRA EL TOTAL REAL 🔴 */}
                        Registros: {RegistrosTotal}
                    </span>

                    {/* ----- 🔴 3. PAGINADOR VUELVE A SER VISIBLE Y FUNCIONAL 🔴 ----- */}
                    <div className="input-group input-group-sm" style={{ width: "150px" }}>
                        <span className="input-group-text bg-light border">Página</span>
                        <select
                            className="form-select"
                            value={Pagina} // <-- Controlado por paginaActual
                            disabled={false} // <-- Reactivado
                            onChange={(e) => CambiarPagina(e.target.value)} // <-- Conectado
                        >
                            {Paginas?.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>
                    {/* ----- -------------------------------------------- ----- */}

                    {/* Botón "Agregar" (sin cambios) */}
                    <button
                        // 🔴 4. FIX: Faltaba la clase 'btn'
                        className="btn btn-primary"
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