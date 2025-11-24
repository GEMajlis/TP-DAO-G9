import React from "react";
import ReservasSearch from "./ReservasSearch"; 

// ----- INICIO CAMBIOS: Se eliminan props de filtros locales -----
export default function ReservasList({
    Reservas,
    Modificar,
    Cancelar,
    Agregar,
    Pagina,
    RegistrosTotal,
    Paginas,
    // (Se fueron Buscar, FiltroDNI, setFiltroDNI, etc.)

    // Props de Búsqueda Backend
    FiltroID,
    setFiltroID,
    BuscarPorID,
    BuscarDelDia,
    Limpiar,
}) {
// ----- FIN CAMBIOS -----
    return (
        
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                <h4 className="mb-4 fw-semibold text-primary" style={{ display: "flex", alignItems: "center" }}>
                    <i className="fa-solid fa-calendar-check me-2"></i>Reservas
                </h4>

                {/* BARRA DE BÚSQUEDA */}
                {/* ----- INICIO CAMBIOS: Se actualiza el pase de props ----- */}
                <ReservasSearch
                    ID={FiltroID}
                    setID={setFiltroID}
                    BuscarPorID={BuscarPorID}
                    BuscarDelDia={BuscarDelDia}
                    Limpiar={Limpiar}
                />
                {/* ----- FIN CAMBIOS ----- */}


                {/* TABLA */}
                <div className="table-responsive">
                    <table
                        className="table table-sm table-hover align-middle"
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        {/* ... (El <thead> de la tabla se queda igual) ... */}
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
                                        {/* ... (Celdas de Id, DNI, Nombre, Patente, etc. se quedan igual) ... */}
                                        <td className="fw-semibold text-center">{reserva.IdReserva}</td>
                                        <td>{reserva.DNICliente}</td>
                                        <td>{reserva.ClienteNombre}</td> 
                                        <td>{reserva.Patente}</td>
                                        <td>{reserva.VehiculoModelo}</td>
                                        <td className="text-center">{reserva.FechaReserva}</td>
                                        <td className="text-center">{reserva.FechaInicio}</td>
                                        <td className="text-center">{reserva.FechaFin}</td>
                                        <td className="text-center">
                                            {(() => {
                                                let claseDeBadge = "";
                                                // Capitalizamos la primera letra
                                                const textoDelEstado = reserva.Estado.charAt(0).toUpperCase() + reserva.Estado.slice(1);

                                                // ----- INICIO CAMBIOS: Switch de colores actualizado -----
                                                switch (reserva.Estado) {
                                                    case "completado":
                                                        claseDeBadge = "bg-success"; // Verde
                                                        break;
                                                    case "confirmado":
                                                        claseDeBadge = "bg-primary"; // Azul
                                                        break;
                                                    case "pendiente":
                                                        claseDeBadge = "bg-warning"; // Amarillo
                                                        break;
                                                    
                                                    // Agregamos ambas variaciones para 'cancelado'
                                                    case "cancelada":
                                                    case "cancelado":
                                                        claseDeBadge = "bg-danger";  // Rojo
                                                        break;
                                                    
                                                    // Agregamos el nuevo estado 'expirada'
                                                    case "expirada":
                                                        claseDeBadge = "bg-dark"; // Negro/Gris Oscuro
                                                        break;

                                                    default:
                                                        claseDeBadge = "bg-secondary"; // Gris
                                                }
                                                // ----- FIN CAMBIOS -----

                                                return (
                                                <span className={`badge rounded-pill ${claseDeBadge} px-3 py-2`}>
                                                    {textoDelEstado}
                                                </span>
                                                );
                                            })()}
                                            </td>
                                        
                                        <td className="text-center text-nowrap">
                                            {/* Modificar (sin cambios) */}
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-1"
                                                onClick={() => Modificar(reserva)}
                                                title="Modificar"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>

                                            {/* ----- INICIO CAMBIOS: Lógica de Cancelar actualizada ----- */}
                                            {/* Solo se pueden cancelar 'pendientes' o 'confirmadas' */}
                                            {(reserva.Estado === "pendiente" || reserva.Estado === "confirmado") && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger me-1" 
                                                    onClick={() => Cancelar(reserva)}
                                                    title="Cancelar Reserva"
                                                >
                                                    <i className="fa-solid fa-ban"></i>
                                                </button>
                                            )}
                                            {/* ----- FIN CAMBIOS ----- */}
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
                        Registros: {RegistrosTotal}
                    </span>

                    {/* ----- INICIO CAMBIOS: Paginador deshabilitado ----- */}
                    {/* El paginador local no tiene sentido si los datos vienen del backend */}
                    <div className="input-group input-group-sm" style={{ width: "150px", visibility: "hidden" }}>
                        <span className="input-group-text bg-light border">Página</span>
                        <select
                            className="form-select"
                            value={Pagina}
                            disabled={true} // Deshabilitado
                            // onChange={(e) => Buscar(e.target.value)} // 'Buscar' ya no existe
                        >
                            {Paginas?.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>
                    {/* ----- FIN CAMBIOS ----- */}

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