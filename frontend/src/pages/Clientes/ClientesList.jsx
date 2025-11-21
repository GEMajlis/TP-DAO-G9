import React from "react";
// Importarás tu componente de búsqueda de clientes aquí
import ClientesSearch from "./ClientesSearch"; 

export default function ClientesList({
    Clientes,       // Array de clientes
    Modificar,      // Función para modificar un cliente
    Eliminar,       // Función para eliminar un cliente
    Agregar,        // Función para agregar un nuevo cliente
    Pagina,         // Página actual
    RegistrosTotal, // Total de registros
    Paginas,        // Array de números de página
    Buscar,         // Función para ejecutar la búsqueda/paginación
    FiltroDNI,      // Estado para el filtro de DNI
    setFiltroDNI,   // Función para actualizar el filtro de DNI
    FiltroNombre,   // Estado para el filtro de Nombre
    setFiltroNombre,// Función para actualizar el filtro de Nombre
}) {
    
    // Puedes mantener una función de "badge" si tus clientes tienen un estado (ej. "Activo", "Inactivo")
    // const getBadgeColor = (estado) => {
    //     switch (estado) {
    //         case "Activo": return "bg-success";
    //         case "Inactivo": return "bg-danger";
    //         default: return "bg-secondary";
    //     }
    // };

    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body p-4">

                <h4 className="card-title mb-0 text-primary fw-bold mb-3">
                    <i className="fa-solid fa-users me-2"></i> {/* Icono cambiado a "usuarios" */}
                    Gestión de Clientes
                </h4>

                {/* Aquí va tu componente de búsqueda */}
                <ClientesSearch
                    DNI={FiltroDNI}
                    setDNI={setFiltroDNI}
                    Nombre={FiltroNombre}
                    setNombre={setFiltroNombre}
                    Buscar={Buscar}
                />

                <div className="table-responsive">
                    <table
                        className={`table table-sm align-middle ${Clientes?.length > 0 ? "table-hover" : ""}`}
                        style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                        <thead className="table-primary text-center">
                            <tr>
                                <th>DNI</th>
                                <th>Nombre</th>
                                <th>Apellido</th> {/* Asumiendo que tienes nombre y apellido separados */}
                                <th>Email</th>
                                <th>Teléfono</th>
                                {/* <th>Estado</th> */}
                                <th className="text-nowrap">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Clientes?.length > 0 ? (
                                Clientes.map((cliente) => (
                                    // Usamos DNI como key, asumiendo que es único
                                    <tr key={cliente.DNI}> 
                                        <td className="fw-semibold text-center">{cliente.DNI}</td>
                                        <td>{cliente.Nombre}</td>
                                        <td>{cliente.Apellido}</td>
                                        <td className="text-center">{cliente.Email}</td>
                                        <td className="text-center">{cliente.Telefono}</td>
                                        {/* <td className="text-center">
                                            <span className={`badge rounded-pill px-3 py-2 ${getBadgeColor(cliente.Estado)}`}>
                                                {cliente.Estado}
                                            </span>
                                        </td> */}
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
                                    {/* Ajusta el colSpan al número de columnas (ej. 6 si incluyes estado) */}
                                    <td colSpan="6" className="text-center py-5 border-0">
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
                        className="btn-primary" // Asegúrate de que esta clase exista en tu CSS (o usa "btn btn-primary")
                        onClick={Agregar}
                    >
                        <i className="fa fa-plus me-2"></i>
                        Nuevo Cliente {/* Texto del botón actualizado */}
                    </button>
                </div>
            </div>
        </div>
    );
}