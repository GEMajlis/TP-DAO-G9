import React, { useState, useEffect } from "react";
import ClientesList from "./ClientesList";
import ClientesForm from "./ClientesForm";
import "../../styles/PageLayout.css";

// ----- 🔴 CAMBIO: Importamos las nuevas funciones del servicio 🔴 -----
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from "../../services/clientesService"; // (¡Ajustá esta ruta si es necesario!)


export default function ClientesPage() {
  const [vista, setVista] = useState("lista");
  const [todosLosClientes, setTodosLosClientes] = useState([]); 
  const [clientes, setClientes] = useState([]); 
  const [filtroDNI, setFiltroDNI] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  
  // ----- 🔴 CAMBIO: 'volverA' ahora empieza en "lista" 🔴 -----
  const [volverA, setVolverA] = useState("lista"); 

  
  // ----- 🔴 CAMBIO: useEffect ahora carga datos de la API 🔴 -----
  useEffect(() => {
    // 1. Definimos una función async para cargar datos
    const cargarClientes = async () => {
      try {
        // 2. Llamamos a la API
        const data = await getClientes(); // Esto ya devuelve el array
        
        // 3. Actualizamos ambos estados con los datos reales
        setTodosLosClientes(data);
        setClientes(data);
      } catch (error) {
        console.error("No se pudieron cargar los clientes:", error);
        alert("Error al cargar clientes: " + error.message);
        setTodosLosClientes([]); 
        setClientes([]);
      }
    };

    // 4. Llamamos a la función de carga solo si la vista es "lista"
    if (vista === "lista") {
      cargarClientes();
    }
    // Se ejecutará cada vez que volvamos a la vista "lista"
  }, [vista]); 


  const handleAgregar = (origen) => {
    setClienteEditando(null);
    // ----- 🔴 CAMBIO: Simplificado, siempre vuelve a "lista" 🔴 -----
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


  // ----- 🔴 CAMBIO: handleEliminar ahora es 'async' y llama a la API 🔴 -----
  const handleEliminar = async (cliente) => {
    if (window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.Nombre} ${cliente.Apellido}?`)) {
      try {
        // 1. Llamamos a la API para eliminar
        await deleteCliente(cliente.DNI);
        
        // 2. Si la API tiene éxito, actualizamos el estado local (la UI)
        setTodosLosClientes(prev => prev.filter(c => c.DNI !== cliente.DNI));
        setClientes(prev => prev.filter(c => c.DNI !== cliente.DNI));

      } catch (error) {
        // 3. Si la API falla, mostramos un error
        console.error("Error al eliminar cliente:", error);
        alert("Error al eliminar el cliente: " + error.message);
      }
    }
  };

  // (handleBuscar se queda igual, sigue filtrando localmente)
  const handleBuscar = (numPagina) => {
    setPagina(numPagina || 1);
    const resultado = todosLosClientes.filter((c) => {
      // Convertimos a String para evitar errores si DNI es numérico
      const dniString = String(c.DNI); 
      const nombreString = String(c.Nombre);
      const cumpleDNI = dniString.toLowerCase().includes(filtroDNI.toLowerCase());
      const cumpleNombre = nombreString.toLowerCase().includes(filtroNombre.toLowerCase());
      return cumpleDNI && cumpleNombre;
    });
    setClientes(resultado);
  };

  
  // ----- 🔴 CAMBIO: handleGuardar ahora es 'async' y llama a la API 🔴 -----
  const handleGuardar = async (clienteForm) => {
    try {
      let nuevaBase;

      if (clienteEditando) { 
        // --- Lógica de Edición ---
        // 1. Llamamos a la API para actualizar
        // (Asegúrate que el DNI no sea editable en el form, o pásalo por separado)
        await updateCliente(clienteEditando.DNI, clienteForm); 
        // 2. Si tiene éxito, actualizamos el estado local
        nuevaBase = todosLosClientes.map((c) => (c.DNI === clienteEditando.DNI ? clienteForm : c));
      
      } else {
        // --- Lógica de Creación ---
        // 1. (Quitamos la validación local, el backend debería hacerlo)
        // 2. Llamamos a la API para crear
        await createCliente(clienteForm);
        // 3. Si tiene éxito, actualizamos el estado local
        // (Nota: Idealmente la API devolvería el nuevo objeto creado)
        nuevaBase = [...todosLosClientes, clienteForm];
      }

      // 4. Sincronizamos el estado y cambiamos de vista
      setTodosLosClientes(nuevaBase);
      setClientes(nuevaBase);
      setFiltroDNI("");
      setFiltroNombre("");
      setVista("lista");

    } catch (error) {
      // 5. Si la API falla (Crear o Editar), mostramos un error
      console.error("Error al guardar cliente:", error);
      alert("Error al guardar el cliente: " + error.message);
    }
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  
  //
  // --- TU JSX DE 'return' QUEDA EXACTAMENTE IGUAL ---
  // ... solo ajusté el botón "Volver" para que ya no dependa de "menu"
  //

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de clientes</h2>
      <p className="page-subtitle">
        Controlá clientes.
      </p>

      {/* (Ya no hay VISTA MENÚ) */}

      {/* ----------- VISTA LISTA ----------- */}
      {vista === "lista" && (
        <div className="fade-in">
          <ClientesList
            Clientes={clientes}
            Consultar={handleConsultar}
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={clientes.length} 
            Paginas={[1]} 
            Buscar={handleBuscar}
            // ----- 🔴 CAMBIO: 'Volver' ya no es necesario si no hay menú 🔴 -----
            // Volver={() => setVista("menu")} // (Podés borrar esta prop de ClientesList)

            FiltroDNI={filtroDNI}
            setFiltroDNI={setFiltroDNI}
            FiltroNombre={filtroNombre}
            setFiltroNombre={setFiltroNombre}
          />
        
        {/* ----- 🔴 CAMBIO: Eliminamos el botón 'Volver al menú' 🔴 ----- */}
        {/* (Si querés podés dejar este div, pero ya no tiene sentido) */}
          {/* <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={() => setVista("menu")}>
              <i className="fa-solid fa-arrow-left me-2"></i>Volver al menú
            </button>
          </div> */}
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
            {/* ----- 🔴 CAMBIO: Botón "Volver" simplificado 🔴 ----- */}
            <button className="btn-secondary px-4" onClick={handleVolverDesdeForm}>
              <i className="fa-solid fa-arrow-left me-2"></i>
              Volver al listado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}