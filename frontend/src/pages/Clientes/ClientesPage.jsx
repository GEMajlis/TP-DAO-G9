import React, { useState, useEffect } from "react";
import ClientesList from "./ClientesList";
import ClientesForm from "./ClientesForm";
import "../../styles/PageLayout.css";

// ----- 🔴 CAMBIO: Importamos TODAS las funciones del servicio 🔴 -----
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  // ¡NUEVAS!
  getClienteByDni,
  getClientesByNombre
} from "../../services/clientesService"; 


export default function ClientesPage() {
  const [vista, setVista] = useState("lista");
  
  // ----- 🔴 CAMBIO: Eliminamos 'todosLosClientes' 🔴 -----
  // const [todosLosClientes, setTodosLosClientes] = useState([]); 
  const [clientes, setClientes] = useState([]); 
  
  const [filtroDNI, setFiltroDNI] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  
  // ----- 🔴 CAMBIO: Estados de Carga y Error 🔴 -----
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [volverA, setVolverA] = useState("lista"); 

  
  // ----- 🔴 CAMBIO: 'fetchClientes' es nuestra nueva función "Traer Todos" 🔴 -----
  const fetchClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes(); // Llama a GET /clientes/
      setClientes(data);
      // Limpiamos los filtros cada vez que recargamos
      setFiltroDNI("");
      setFiltroNombre("");
    } catch (error) {
      console.error("No se pudieron cargar los clientes:", error);
      setError("Error al cargar clientes: " + error.message);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  // El useEffect ahora solo carga los clientes una vez al inicio
  useEffect(() => {
    fetchClientes();
  }, []); // El array vacío asegura que se ejecute solo 1 vez


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


  // ----- 🔴 CAMBIO: 'handleEliminar' ahora recarga la lista 🔴 -----
  const handleEliminar = async (cliente) => {
    if (window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.Nombre} ${cliente.Apellido}?`)) {
      setLoading(true); // Mostramos feedback
      setError(null);
      try {
        await deleteCliente(cliente.DNI);
        // En lugar de filtrar localmente, volvemos a pedir la lista
        await fetchClientes(); 
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        setError("Error al eliminar el cliente: " + error.message);
        setLoading(false); // Apagamos el loading si hay error
      }
      // 'fetchClientes' se encarga de apagar el loading si todo va bien
    }
  };


  // ----- 🔴 CAMBIO: Se elimina 'handleBuscar' (filtro local) 🔴 -----
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
      // 1. Llamamos al servicio
      const resultado = await getClienteByDni(filtroDNI);
      // 2. El servicio devuelve 1 objeto, la tabla espera un array
      setClientes(resultado ? [resultado] : []);
      setFiltroNombre(""); // Limpiamos el otro filtro
    } catch (err) {
      console.error("Error buscando por DNI:", err);
      setError(err.message);
      setClientes([]); // Mostramos tabla vacía si hay error (ej: 404)
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
      // 1. Llamamos al servicio
      const resultado = await getClientesByNombre(filtroNombre);
      // 2. El servicio ya devuelve un array
      setClientes(resultado);
      setFiltroDNI(""); // Limpiamos el otro filtro
    } catch (err) {
      console.error("Error buscando por Nombre:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    // 'fetchClientes' ya limpia los filtros y recarga todo
    fetchClientes(); 
  };
  

  // ----- 🔴 CAMBIO: 'handleGuardar' ahora recarga la lista 🔴 -----
  const handleGuardar = async (clienteForm) => {
    setLoading(true); // Mostramos feedback
    setError(null);
    try {
      if (clienteEditando) { 
        await updateCliente(clienteEditando.DNI, clienteForm); 
      } else {
        await createCliente(clienteForm);
      }
      
      // Si todo OK, recargamos la lista desde el backend
      await fetchClientes();
      setVista("lista"); // Volvemos a la lista

    } catch (error) {
      console.error("Error al guardar cliente:", error);
      setError("Error al guardar el cliente: " + error.message);
      setLoading(false); // Apagamos el loading si hay error
    }
    // 'fetchClientes' se encarga de apagar el loading si todo va bien
  };

  const handleVolverDesdeForm = () => {
    setError(null); // Limpiamos errores al volver
    setVista(volverA);
  };

  
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de clientes</h2>
      <p className="page-subtitle">
        Controlá clientes.
      </p>
      
      {/* ----- 🔴 CAMBIO: JSX de Loading y Error 🔴 ----- */}
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
      {/* ----- 🔴 CAMBIO: Ocultamos si está cargando 🔴 ----- */}
      {vista === "lista" && !loading && (
        <div className="fade-in">
          
          {/* ----- 🔴 CAMBIO: Pasamos las NUEVAS props de búsqueda 🔴 ----- */}
          <ClientesList
            Clientes={clientes}
            Consultar={handleConsultar}
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={1} // La paginación local ya no aplica
            RegistrosTotal={clientes.length} 
            Paginas={[1]} 
            
            // Se va el 'Buscar' local
            // Buscar={handleBuscar} 
            
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
      {vista === "form" && (
        <div className="fade-in">
          <ClientesForm
            Cliente={clienteEditando} 
            Guardar={handleGuardar}
            Cancelar={handleVolverDesdeForm}
          />

          <div className="text-center mt-4 mb-3">
            <button 
              className="btn-secondary px-4" 
              onClick={handleVolverDesdeForm}
              disabled={loading} // Deshabilitamos si está guardando
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