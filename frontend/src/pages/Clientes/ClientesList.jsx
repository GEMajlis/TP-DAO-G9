import React from "react";
// Importarás tu componente de búsqueda de clientes aquí
import ClientesSearch from "./ClientesSearch"; 

// ----- INICIO CAMBIOS: Recibimos las nuevas props del "cerebro" -----
export default function ClientesList({
    Clientes,       // Array de clientes
    Modificar,      // Función para modificar un cliente
    Eliminar,       // Función para eliminar un cliente
    Agregar,        // Función para agregar un nuevo cliente
    Pagina,         // Página actual
    RegistrosTotal, // Total de registros
    Paginas,        // Array de números de página
    // Se fue 'Buscar'
    FiltroDNI,      // Estado para el filtro de DNI
    setFiltroDNI,   // Función para actualizar el filtro de DNI
    FiltroNombre,   // Estado para el filtro de Nombre
    setFiltroNombre,// Función para actualizar el filtro de Nombre

    // ¡Nuevas props!
    BuscarPorDNI,
    BuscarPorNombre,
    Limpiar,
}) {
// ----- FIN CAMBIOS -----
    
    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                <h4 className="card-title mb-0 text-primary fw-bold mb-3">
                    <i className="fa-solid fa-users me-2"></i> {/* Icono cambiado a "usuarios" */}
                    Gestión de Clientes
                </h4>

                {/* Aquí va tu componente de búsqueda */}
                {/* ----- INICIO CAMBIOS: Pasamos las nuevas props al Search ----- */}
                <ClientesSearch
                    DNI={FiltroDNI}
                    setDNI={setFiltroDNI}
                    Nombre={FiltroNombre}
                    setNombre={setFiltroNombre}
                    // Se fue 'Buscar={Buscar}'
                    
                    // ¡Nuevas props!
                    BuscarPorDNI={BuscarPorDNI}
                    BuscarPorNombre={BuscarPorNombre}
                    Limpiar={Limpiar}
                />
                {/* ----- FIN CAMBIOS ----- */}

                <div className="table-responsive">
                    <table
                        className={`table table-sm align-middle ${Clientes?.length > 0 ? "table-hover" : ""}`}
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        <thead className="table-primary text-center">
                            <tr>
                                <th>DNI</th>
                                <th>Nombre</th>
                                <th>Apellido</th> 
                                <th>Teléfono</th>
                                <th className="text-nowrap">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Clientes?.length > 0 ? (
                                Clientes.map((cliente) => (
                                    <tr key={cliente.DNI}> 
                                        <td className="fw-semibold text-center">{cliente.DNI}</td>
                                        <td>{cliente.Nombre}</td>
                                        <td>{cliente.Apellido}</td>
                                        <td className="text-center">{cliente.Telefono}</td>
                                        <td className="text-center text-nowrap">
                                            <button
                                                className="btn btn-sm btn-outline-secondary me-1"
                                                onClick={() => Modificar(cliente)}
                                                title="Modificar"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => Eliminar(cliente)}
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
                                            No se encontraron clientes con esos criterios.
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER (Paginación y botón de Agregar) */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="badge bg-light text-dark border px-3 py-2 fs-6">
                        Registros: {RegistrosTotal}
                    </span>

                    {/* ----- INICIO CAMBIOS: Ocultamos el paginador local ----- */}
                    {/* (Ya no aplica, la búsqueda es por backend) */}
                    <div className="input-group input-group-sm" style={{ width: "150px", visibility: "hidden" }}>
                        <span className="input-group-text bg-light border">Página</span>
                        <select
                            className="form-select"
                            value={Pagina}
                            // onChange={(e) => Buscar(e.target.value)} // 'Buscar' ya no existe
                            disabled={true}
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
                        Nuevo Cliente 
                    </button>
                </div>
            </div>
        </div>
    );
}