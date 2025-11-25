import React, { useState, useEffect } from "react";
import EmpleadosList from "./EmpleadosList";
import EmpleadosForm from "./EmpleadosForm";
import "../../styles/PageLayout.css";
import { 
    getEmpleados, 
    createEmpleado, 
    updateEmpleado, 
    deleteEmpleado,
    getEmpleadoByDni,
    getEmpleadosByNombre
} from "../../services/empleadosService"; 

// ----- 🔴 1. CONSTANTE DE PAGINACIÓN 🔴 -----
const REGISTROS_POR_PAGINA = 10;
// ------------------------------------------

export default function EmpleadosPage() {
    const [vista, setVista] = useState("lista");
    
    // ----- 🔴 2. ESTADOS DE LISTA SEPARADOS 🔴 -----
    // 'empleados' ahora es 'empleadosMostrados' (la "rebanada" que ve el usuario)
    const [empleadosMostrados, setEmpleadosMostrados] = useState([]);
    // NUEVO: 'todosLosEmpleados' (la lista "master" completa sin tocar)
    const [todosLosEmpleados, setTodosLosEmpleados] = useState([]);
    // -------------------------------------------
    
    const [filtroDNI, setFiltroDNI] = useState("");
    const [filtroNombre, setFiltroNombre] = useState("");
    
    // ----- 🔴 3. ESTADOS DE PAGINACIÓN REALES 🔴 -----
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginasTotales, setPaginasTotales] = useState([]); // Ya no es [1]
    // ---------------------------------------

    const [empleadoEditando, setEmpleadoEditando] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [volverA, setVolverA] = useState("menu");

    
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
        setEmpleadosMostrados(listaCompleta.slice(inicio, fin));
    };
    // --------------------------------------------------

    
    // ----- 🔴 5. 'fetchEmpleados' ES AHORA LA CARGA INICIAL (LENTA) 🔴 -----
    const fetchEmpleados = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API y trae TODOS los empleados (ej: 5,000)
            const data = await getEmpleados();

            // 2. Guarda la "copia master" completa
            setTodosLosEmpleados(data); 

            // 3. Llama al helper para mostrar solo la Página 1 de esos 5,000
            actualizarPaginacion(data, 1);
            
            // 4. Limpiamos los filtros
            setFiltroDNI("");
            setFiltroNombre("");
        } catch (error) {
            console.error("No se pudieron cargar los empleados:", error);
            setError("No se pudieron cargar los empleados.");
            setTodosLosEmpleados([]);
            setEmpleadosMostrados([]);
        } finally {
            setLoading(false);
        }
    };
    // ---------------------------------------------------------

    // useEffect se queda igual, llama a la carga inicial 1 SOLA VEZ
    useEffect(() => {
        fetchEmpleados();
    }, []); 


    const handleAgregar = (origen) => {
        setEmpleadoEditando(null);
        setVolverA(origen); 
        setVista("form");
    };

    const handleModificar = (empleado) => {
        setEmpleadoEditando(empleado);
        setVolverA("lista"); 
        setVista("form");
    };

    const handleConsultar = (empleado) => {
        alert(`Consultando: ${empleado.DNI}`);
    };

    // ----- 🔴 6. 'handleEliminar' DEBE RECARGAR TODO 🔴 -----
    // (Para que la "copia master" se actualice)
    const handleEliminar = async (empleado) => {
        if (window.confirm(`¿Estás seguro de eliminar al empleado ${empleado.Nombre} ${empleado.Apellido}?`)) {
            setLoading(true);
            setError(null);
            try {
                // 1. Llamamos a la API para eliminar
                await deleteEmpleado(empleado.DNI);
                
                // 2. Si tiene éxito, recargamos la lista "master"
                await fetchEmpleados();

            } catch (error) {
                console.error("Error al eliminar empleado:", error);
                setError("Error al eliminar el empleado.");
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
            const resultado = await getEmpleadoByDni(filtroDNI);

            // 2. REEMPLAZA la lista mostrada (solo 1 item)
            setEmpleadosMostrados(resultado ? [resultado] : []);
            
            // 3. Fija el paginador a "Página 1 de 1"
            setPaginasTotales([1]);
            setPaginaActual(1);

            setFiltroNombre(""); 
        } catch (err) {
            console.error("Error buscando por DNI:", err);
            setError(err.message);
            setEmpleadosMostrados([]); 
            setPaginasTotales([1]);
            setPaginaActual(1);
        } finally {
            setLoading(false);
        }
    };

    // ----- 🔴 8. BÚSQUEDA BACKEND POR NOMBRE (SOBREESCRIBE) 🔴 -----
    const handleBuscarPorNombre = async () => {
        if (!filtroNombre) {
            setError("Debe ingresar un Nombre para buscar.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // 1. Llama a la API (rápido)
            const resultado = await getEmpleadosByNombre(filtroNombre);
            
            // 2. ¡PAGINA LOCALMENTE LOS RESULTADOS!
            // (Si "García" devuelve 30 empleados, los pagina)
            actualizarPaginacion(resultado, 1);
            
            setFiltroDNI(""); 
        } catch (err) {
            console.error("Error buscando por Nombre:", err);
            setError(err.message);
            setEmpleadosMostrados([]);
            setPaginasTotales([1]);
            setPaginaActual(1);
        } finally {
            setLoading(false);
        }
    };
    // ---------------------------------------------------------

    // ----- 🔴 9. 'handleLimpiar' AHORA ES LOCAL (RÁPIDO) 🔴 -----
    const handleLimpiar = () => {
        setError(null);
        setFiltroDNI("");
        setFiltroNombre("");
        // 1. Llama al helper para restaurar la Página 1 de la lista master
        actualizarPaginacion(todosLosEmpleados, 1);
    };
    // -------------------------------------------------------


    // handleGuardar se queda igual (¡ya llamaba a fetchEmpleados!)
    // Esto es vital para que la "copia master" se actualice al crear/modificar
    const handleGuardar = async (empleadoForm) => {
        setLoading(true);
        setError(null);
        try {
            if (empleadoEditando) { 
                await updateEmpleado(empleadoEditando.DNI, empleadoForm);
            } else {
                await createEmpleado(empleadoForm);
            }
            await fetchEmpleados(); // <-- Perfecto. Recarga la "copia master"
            setVista("lista"); 

        } catch (error) {
            console.error("Error al guardar empleado:", error);
            setError("Error al guardar el empleado: " + error.message);
            setLoading(false); 
        }
    };

    const handleVolverDesdeForm = () => {
        setError(null); 
        setVista(volverA);
    };

    // ----- 🔴 10. NUEVA FUNCIÓN PARA EL PAGINADOR LOCAL 🔴 -----
    const handleCambiarPagina = (numPagina) => {
        const paginaNum = parseInt(numPagina);
        
        // Simplemente llama al helper para "rebanar" la lista master
        actualizarPaginacion(todosLosEmpleados, paginaNum);
    };
    // -----------------------------------------------------


    return (
        <div className="page-container">
            <h2 className="page-title">Gestión de Empleados</h2>
            <p className="page-subtitle">
                Controlá empleados.
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
                
                {/* ----- 🔴 11. PASAMOS LAS NUEVAS PROPS AL LISTADO 🔴 ----- */}
                <EmpleadosList
                    // La lista "rebanada"
                    Empleados={empleadosMostrados}

                    Consultar={handleConsultar}
                    Modificar={handleModificar}
                    Eliminar={handleEliminar}
                    Agregar={() => handleAgregar("lista")}
                    
                    // El total REAL de la "copia master" (ej: 5,000)
                    RegistrosTotal={todosLosEmpleados.length}

                    // Los estados de paginación
                    Pagina={paginaActual} 
                    Paginas={paginasTotales}

                    // La NUEVA función para cambiar de página
                    CambiarPagina={handleCambiarPagina}
                    
                    Volver={() => setVista("menu")} 
                    
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
                <EmpleadosForm
                    Empleado={empleadoEditando} 
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
                        {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
                    </button>
                </div>
            </div>
            )}
        </div>
    );
}