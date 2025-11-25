import React, { useState, useEffect } from "react";
import ClientesList from "./ClientesList";
import ClientesForm from "./ClientesForm";
import "../../styles/PageLayout.css";
import {
    getClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    getClienteByDni,
    getClientesByNombre
} from "../../services/clientesService"; 

// ----- 🔴 1. CONSTANTE DE PAGINACIÓN 🔴 -----
const REGISTROS_POR_PAGINA = 10;
// ------------------------------------------

export default function ClientesPage() {
    const [vista, setVista] = useState("lista");
    
    // ----- 🔴 2. ESTADOS DE LISTA SEPARADOS 🔴 -----
    // 'clientes' ahora es 'clientesMostrados' (la "rebanada" que ve el usuario)
    const [clientesMostrados, setClientesMostrados] = useState([]);
    // NUEVO: 'todosLosClientes' (la lista "master" completa sin tocar)
    const [todosLosClientes, setTodosLosClientes] = useState([]);
    // -------------------------------------------
    
    const [filtroDNI, setFiltroDNI] = useState("");
    const [filtroNombre, setFiltroNombre] = useState("");
    
    // ----- 🔴 3. ESTADOS DE PAGINACIÓN REALES 🔴 -----
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasTotales, setPaginasTotales] = useState([]); // Ya no es [1]
    // ---------------------------------------

    const [clienteEditando, setClienteEditando] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [volverA, setVolverA] = useState("lista"); 

    
    // ----- 🔴 4. HELPER PARA PAGINAR LOCALMENTE 🔴 -----
    // Esta función calcula la "rebanada" de la lista master y actualiza los estados
    const actualizarPaginacion = (listaCompleta, numPagina) => {
        const paginaNum = parseInt(numPagina);
        
        // Calcular total de páginas
        const totalPag = Math.ceil(listaCompleta.length / REGISTROS_POR_PAGINA);
        // Crear el array [1, 2, ..., N] (aseguramos al menos 1 página)
        const arrPaginas = Array.from({ length: totalPag || 1 }, (_, i) => i + 1);
        
        // Calcular la "rebanada" (.slice())
        const inicio = (paginaNum - 1) * REGISTROS_POR_PAGINA;
        const fin = paginaNum * REGISTROS_POR_PAGINA;
        
        // Actualizar todos los estados de React
        setPaginasTotales(arrPaginas);
        setPaginaActual(paginaNum);
        setClientesMostrados(listaCompleta.slice(inicio, fin));
    };
    // --------------------------------------------------

    
    // ----- 🔴 5. 'fetchClientes' ES AHORA LA CARGA INICIAL (LENTA) 🔴 -----
    const fetchClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API y trae TODOS los clientes (ej: 5,000)
            const data = await getClientes(); // Llama a GET /clientes/
            
            // 2. Guarda la "copia master" completa
            setTodosLosClientes(data);

            // 3. Llama al helper para mostrar solo la Página 1 de esos 5,000
            actualizarPaginacion(data, 1);
            
            // 4. Limpiamos los filtros
            setFiltroDNI("");
            setFiltroNombre("");
        } catch (error) {
            console.error("No se pudieron cargar los clientes:", error);
            setError("Error al cargar clientes: " + error.message);
            setTodosLosClientes([]);
            setClientesMostrados([]);
        } finally {
            setLoading(false);
        }
    };
    // ---------------------------------------------------------

    // useEffect se queda igual, llama a la carga inicial 1 SOLA VEZ
    useEffect(() => {
        fetchClientes();
    }, []); 


    const handleAgregar = (origen) => {
        setClienteEditando(null);
        setVolverA("lista"); 
        setVista("form");
    };

    const handleModificar = (cliente) => {
        setClienteEditando(cliente);
        setVolverA("lista"); 
        setVista("form");
    };

    const handleConsultar = (cliente) => {
        alert(`Consultando: ${cliente.DNI}`);
    };


    // ----- 🔴 6. 'handleEliminar' DEBE RECARGAR TODO 🔴 -----
    // (Tu código ya hacía esto, ¡perfecto!)
    const handleEliminar = async (cliente) => {
        if (window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.Nombre} ${cliente.Apellido}?`)) {
            setLoading(true); 
            setError(null);
            try {
                await deleteCliente(cliente.DNI);
                // Vuelve a pedir la lista "master" para refrescarla
                await fetchClientes(); 
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
                setError("Error al eliminar el cliente: " + error.message);
                setLoading(false); 
            }
        }
    };
    // -------------------------------------------------


    // ----- 🔴 7. BÚSQUEDA BACKEND POR DNI (SOBREESCRIBE) 🔴 -----
    const handleBuscarPorDNI = async () => {
        if (!filtroDNI) {
            setError("Debe ingresar un DNI para buscar.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API (rápido)
            const resultado = await getClienteByDni(filtroDNI);
            
            // 2. REEMPLAZA la lista mostrada (solo 1 item)
            setClientesMostrados(resultado ? [resultado] : []);
            
            // 3. Fija el paginador a "Página 1 de 1"
            setPaginasTotales([1]);
            setPaginaActual(1);

            setFiltroNombre(""); 
        } catch (err) {
            console.error("Error buscando por DNI:", err);
            setError(err.message);
            setClientesMostrados([]); 
            setPaginasTotales([1]);
            setPaginaActual(1);
        } finally {
            setLoading(false);
        }
    };

    // ----- 🔴 8. BÚSQUEDA BACKEND POR NOMBRE (SOBREESCRIBE Y PAGINA) 🔴 -----
    const handleBuscarPorNombre = async () => {
        if (!filtroNombre) {
            setError("Debe ingresar un Nombre para buscar.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API (rápido)
            const resultado = await getClientesByNombre(filtroNombre);
            
            // 2. ¡PAGINA LOCALMENTE LOS RESULTADOS!
            // (Si "García" devuelve 30 clientes, los pagina)
            actualizarPaginacion(resultado, 1);
            
            setFiltroDNI(""); 
        } catch (err) {
            console.error("Error buscando por Nombre:", err);
            setError(err.message);
            setClientesMostrados([]);
            setPaginasTotales([1]);
            setPaginaActual(1);
        } finally {
            setLoading(false);
        }
    };

    // ----- 🔴 9. 'handleLimpiar' AHORA ES LOCAL (RÁPIDO) 🔴 -----
    const handleLimpiar = () => {
        setError(null);
        setFiltroDNI("");
        setFiltroNombre("");
        // 1. Llama al helper para restaurar la Página 1 de la lista master
        actualizarPaginacion(todosLosClientes, 1);
    };
    // -------------------------------------------------------
    

    // ----- 🔴 10. 'handleGuardar' DEBE RECARGAR TODO 🔴 -----
    // (Tu código ya hacía esto, ¡perfecto!)
    const handleGuardar = async (clienteForm) => {
        setLoading(true); 
        setError(null);
        try {
            if (clienteEditando) { 
                await updateCliente(clienteEditando.DNI, clienteForm); 
            } else {
                await createCliente(clienteForm);
            }
            
            // Vuelve a pedir la lista "master" para refrescarla
            await fetchClientes();
            setVista("lista"); 

        } catch (error) {
            console.error("Error al guardar cliente:", error);
            setError("Error al guardar el cliente: " + error.message);
            setLoading(false); 
        }
    };
    // -----------------------------------------------------

    const handleVolverDesdeForm = () => {
        setError(null); 
        setVista(volverA);
    };

    // ----- 🔴 11. NUEVA FUNCIÓN PARA EL PAGINADOR LOCAL 🔴 -----
    const handleCambiarPagina = (numPagina) => {
        const paginaNum = parseInt(numPagina);
        
        // Simplemente llama al helper para "rebanar" la lista master
        actualizarPaginacion(todosLosClientes, paginaNum);
    };
    // -----------------------------------------------------

    
    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de clientes</h2>
            <p className="page-subtitle">
                Controlá clientes.
            </p>
            
            {/* (El JSX de Error y Loading se queda igual) */}
            {error && (
                <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                </div>
            )}
            {loading && (
                <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando datos...</p>
                </div>
            )}
            {/* ----- 🔴 FIN CAMBIO 🔴 ----- */}
            

            {/* ----------- VISTA LISTA ----------- */}
            {vista === "lista" && !loading && (
                <div className="fade-in">
                
                {/* ----- 🔴 12. PASAMOS LAS NUEVAS PROPS AL LISTADO 🔴 ----- */}
                <ClientesList
                    // La lista "rebanada"
                    Clientes={clientesMostrados}

                    Consultar={handleConsultar}
                    Modificar={handleModificar}
                    Eliminar={handleEliminar}
                    Agregar={() => handleAgregar("lista")}
                    
                    // El total REAL de la "copia master" (ej: 5,000)
                    RegistrosTotal={todosLosClientes.length}

                    // Los estados de paginación
                    Pagina={paginaActual} 
                    Paginas={paginasTotales}

                    // La NUEVA función para cambiar de página
                    CambiarPagina={handleCambiarPagina}
                    
                    // Pasamos los filtros (igual que antes)
                    FiltroDNI={filtroDNI}
                    setFiltroDNI={setFiltroDNI}
                    FiltroNombre={filtroNombre}
                    setFiltroNombre={setFiltroNombre}

                    // Pasamos las funciones de backend (igual que antes)
                    BuscarPorDNI={handleBuscarPorDNI}
                    BuscarPorNombre={handleBuscarPorNombre}
                    Limpiar={handleLimpiar}
                />
                {/* --------------------------------------------------- */}
                </div>
            )}

            {/* ----------- VISTA FORMULARIO (Sin cambios) ----------- */}
            {vista === "form" && (
                <div className="fade-in">
                <ClientesForm
                    Cliente={clienteEditando} 
                    Guardar={handleGuardar}
                    Cancelar={handleVolverDesdeForm}
                />

                <div className="text-center mt-4 mb-3">
                    <button 
                        className="btn btn-secondary px-4" 
                        onClick={handleVolverDesdeForm}
                        disabled={loading} 
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Volver al listado
                    </button>
                </div>
                </div>
            )}
        </div>
    );
}