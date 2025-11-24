import React, { useState, useEffect } from "react";
import EmpleadosList from "./EmpleadosList";
import EmpleadosForm from "./EmpleadosForm";
import "../../styles/PageLayout.css";

// ----- 🔴 CAMBIO: Importamos TODAS las funciones del servicio 🔴 -----
import { 
  getEmpleados, 
  createEmpleado, 
  updateEmpleado, 
  deleteEmpleado,
  // ¡NUEVAS!
  getEmpleadoByDni,
  getEmpleadosByNombre
} from "../../services/empleadosService"; 


export default function EmpleadosPage() {
  const [vista, setVista] = useState("lista");
  
  // ----- 🔴 CAMBIO: Eliminamos 'todosLosEmpleados' 🔴 -----
  // const [todosLosEmpleados, setTodosLosEmpleados] = useState([]); 
  const [empleados, setEmpleados] = useState([]); 
  
  const [filtroDNI, setFiltroDNI] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  
  // ----- 🔴 CAMBIO: Eliminamos 'pagina' y agregamos 'loading' y 'error' 🔴 -----
  // const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [volverA, setVolverA] = useState("menu");

  
  // ----- 🔴 CAMBIO: 'fetchEmpleados' reemplaza a 'cargarEmpleados' 🔴 -----
  // Esta será nuestra función para "Limpiar" y "Cargar Todo"
  const fetchEmpleados = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEmpleados();
      // Ya no guardamos en "todos", solo en la lista visible
      setEmpleados(data); 
      // Limpiamos los filtros
      setFiltroDNI("");
      setFiltroNombre("");
    } catch (error) {
      console.error("No se pudieron cargar los empleados:", error);
      setError("No se pudieron cargar los empleados.");
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  // ----- 🔴 CAMBIO: El useEffect ahora solo carga 1 vez al inicio 🔴 -----
  useEffect(() => {
    fetchEmpleados();
  }, []); // El array vacío asegura que se ejecute solo una vez


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


  // ----- 🔴 CAMBIO: 'handleEliminar' ahora recarga la lista 🔴 -----
  const handleEliminar = async (empleado) => {
    if (window.confirm(`¿Estás seguro de eliminar al empleado ${empleado.Nombre} ${empleado.Apellido}?`)) {
      setLoading(true);
      setError(null);
      try {
        // 1. Llamamos a la API para eliminar
        await deleteEmpleado(empleado.DNI);
        
        // 2. Si tiene éxito, recargamos la lista desde el backend
        await fetchEmpleados();

      } catch (error) {
        console.error("Error al eliminar empleado:", error);
        setError("Error al eliminar el empleado.");
        setLoading(false); // Importante: frenar el loading si hay error
      }
      // 'fetchEmpleados' apaga el loading si todo sale bien
    }
  };

  
  // ----- 🔴 CAMBIO: Eliminamos 'handleBuscar' (filtro local) 🔴 -----
  // const handleBuscar = (numPagina) => { ... };


  // ----- 🔴 CAMBIO: NUEVAS funciones de Búsqueda de Backend 🔴 -----

  const handleBuscarPorDNI = async () => {
    if (!filtroDNI) {
      setError("Debe ingresar un DNI para buscar.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resultado = await getEmpleadoByDni(filtroDNI);
      // El servicio devuelve 1 objeto, la tabla espera un array
      setEmpleados(resultado ? [resultado] : []);
      setFiltroNombre(""); // Limpiamos el otro filtro
    } catch (err) {
      console.error("Error buscando por DNI:", err);
      setError(err.message);
      setEmpleados([]); // Mostramos tabla vacía si hay error (ej: 404)
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarPorNombre = async () => {
    if (!filtroNombre) {
      setError("Debe ingresar un Nombre para buscar.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resultado = await getEmpleadosByNombre(filtroNombre);
      // El servicio ya devuelve un array
      setEmpleados(resultado);
      setFiltroDNI(""); // Limpiamos el otro filtro
    } catch (err) {
      console.error("Error buscando por Nombre:", err);
      setError(err.message);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    // 'fetchEmpleados' ya limpia los filtros y recarga todo
    fetchEmpleados(); 
  };


  // ----- 🔴 CAMBIO: 'handleGuardar' ahora recarga la lista 🔴 -----
  const handleGuardar = async (empleadoForm) => {
    setLoading(true);
    setError(null);
    try {
      if (empleadoEditando) { 
        // --- Lógica de Edición ---
        await updateEmpleado(empleadoEditando.DNI, empleadoForm);
      } else {
        // --- Lógica de Creación ---
        // ¡Eliminamos la validación local! El backend debe hacerlo.
        await createEmpleado(empleadoForm);
      }

      // 4. Si todo OK, recargamos la lista desde el backend
      await fetchEmpleados();
      setVista("lista"); // Volvemos a la lista

    } catch (error) {
      console.error("Error al guardar empleado:", error);
      setError("Error al guardar el empleado: " + error.message);
      setLoading(false); // Frenamos el loading si hay error
    }
    // 'fetchEmpleados' apaga el loading si todo sale bien
  };

  const handleVolverDesdeForm = () => {
    setError(null); // Limpiamos errores al volver
    setVista(volverA);
  };


  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Empleados</h2>
      <p className="page-subtitle">
        Controlá empleados.
      </p>

      {/* ----- 🔴 CAMBIO: JSX de Loading y Error 🔴 ----- */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
<button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>        </div>
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
      {/* ----- 🔴 CAMBIO: Ocultamos la lista si está cargando 🔴 ----- */}
      {vista === "lista" && !loading && (
        <div className="fade-in">
          
          {/* ----- 🔴 CAMBIO: Pasamos las NUEVAS props de búsqueda 🔴 ----- */}
          <EmpleadosList
            Empleados={empleados}
            Consultar={handleConsultar}
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            
            Pagina={1} // Paginación local eliminada
            RegistrosTotal={empleados.length}
            Paginas={[1]} 
            
            // Se va 'Buscar'
            // Buscar={handleBuscar} 
            
            Volver={() => setVista("menu")} // Mantenemos esto
            
            // Pasamos los filtros
            FiltroDNI={filtroDNI}
            setFiltroDNI={setFiltroDNI}
            FiltroNombre={filtroNombre}
            setFiltroNombre={setFiltroNombre}

            // ¡Pasamos las NUEVAS funciones de backend!
            BuscarPorDNI={handleBuscarPorDNI}
            BuscarPorNombre={handleBuscarPorNombre}
            Limpiar={handleLimpiar}
          />
        </div>
      )}

      {/* ----------- VISTA FORMULARIO ----------- */}
      {/* (Ocultamos el form si la lista está cargando) */}
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
              disabled={loading} // Deshabilitamos si está guardando
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