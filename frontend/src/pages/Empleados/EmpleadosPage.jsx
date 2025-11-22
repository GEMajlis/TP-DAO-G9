import React, { useState, useEffect } from "react";
import EmpleadosList from "./EmpleadosList";
import EmpleadosForm from "./EmpleadosForm";
import "../../styles/PageLayout.css";

// ----- 🔴 CAMBIO: Importamos las nuevas funciones del servicio 🔴 -----
import { 
  getEmpleados, 
  createEmpleado, 
  updateEmpleado, 
  deleteEmpleado 
} from "../../services/empleadosService"; // (¡Ajustá esta ruta!)


export default function EmpleadosPage() {
  const [vista, setVista] = useState("lista");
  const [todosLosEmpleados, setTodosLosEmpleados] = useState([]); 
  const [empleados, setEmpleados] = useState([]); 
  const [filtroDNI, setFiltroDNI] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");

  
  // (Este useEffect se queda igual, llamando a getEmpleados)
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const data = await getEmpleados();
        setTodosLosEmpleados(data);
        setEmpleados(data);
      } catch (error) {
        console.error("No se pudieron cargar los empleados:", error);
        setTodosLosEmpleados([]); 
        setEmpleados([]);
      }
    };

    if (vista === "lista") {
      cargarEmpleados();
    }
  }, [vista]); 


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


  // ----- 🔴 CAMBIO: handleEliminar ahora es 'async' y llama a la API 🔴 -----
  const handleEliminar = async (empleado) => {
    if (window.confirm(`¿Estás seguro de eliminar al empleado ${empleado.Nombre} ${empleado.Apellido}?`)) {
      try {
        // 1. Llamamos a la API para eliminar
        await deleteEmpleado(empleado.DNI);
        
        // 2. Si la API tiene éxito, actualizamos el estado local (la UI)
        setTodosLosEmpleados(prev => prev.filter(e => e.DNI !== empleado.DNI));
        setEmpleados(prev => prev.filter(e => e.DNI !== empleado.DNI));

      } catch (error) {
        // 3. Si la API falla, mostramos un error
        console.error("Error al eliminar empleado:", error);
        alert("Error al eliminar el empleado. Revise la consola.");
      }
    }
  };

  // (handleBuscar se queda igual)
  const handleBuscar = (numPagina) => {
    setPagina(numPagina || 1);
    const resultado = todosLosEmpleados.filter((e) => {
      const dniString = String(e.DNI);
      const nombreString = String(e.Nombre);
      const cumpleDNI = dniString.toLowerCase().includes(filtroDNI.toLowerCase());
      const cumpleNombre = nombreString.toLowerCase().includes(filtroNombre.toLowerCase());
      return cumpleDNI && cumpleNombre;
    });
    setEmpleados(resultado);
  };

  
  // ----- 🔴 CAMBIO: handleGuardar ahora es 'async' y llama a la API 🔴 -----
  const handleGuardar = async (empleadoForm) => {
    try {
      let nuevaBase;

      if (empleadoEditando) { 
        // --- Lógica de Edición ---
        // 1. Llamamos a la API para actualizar
        await updateEmpleado(empleadoEditando.DNI, empleadoForm);
        // 2. Si tiene éxito, actualizamos el estado local
        nuevaBase = todosLosEmpleados.map((e) => (e.DNI === empleadoForm.DNI ? empleadoForm : e));
      
      } else {
        // --- Lógica de Creación ---
        // 1. Validamos localmente primero
        const existe = todosLosEmpleados.some(e => e.DNI === empleadoForm.DNI);
        if (existe) {
          alert("Ya existe un empleado con ese DNI.");
          return; // Salimos antes de llamar a la API
        }
        // 2. Llamamos a la API para crear
        await createEmpleado(empleadoForm);
        // 3. Si tiene éxito, actualizamos el estado local
        // (Nota: Asumimos que el empleadoForm es válido. Idealmente, la API
        //  devolvería el objeto creado y lo usaríamos aquí)
        nuevaBase = [...todosLosEmpleados, empleadoForm];
      }

      // 4. Sincronizamos el estado y cambiamos de vista
      setTodosLosEmpleados(nuevaBase);
      setEmpleados(nuevaBase);
      setFiltroDNI("");
      setFiltroNombre("");
      setVista("lista");

    } catch (error) {
      // 5. Si la API falla (Crear o Editar), mostramos un error
      console.error("Error al guardar empleado:", error);
      alert("Error al guardar el empleado. Revise la consola.");
    }
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  
  //
  // --- TU JSX DE 'return' QUEDA EXACTAMENTE IGUAL ---
  //

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Empleados</h2>
      <p className="page-subtitle">
        Controlá empleados.
      </p>

      

      {/* ----------- VISTA LISTA (SIN CAMBIOS) ----------- */}
      {vista === "lista" && (
        <div className="fade-in">
          <EmpleadosList
            Empleados={empleados}
            Consultar={handleConsultar}
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={empleados.length}
            Paginas={[1]} 
            Buscar={handleBuscar}
            Volver={() => setVista("menu")}
            FiltroDNI={filtroDNI}
            setFiltroDNI={setFiltroDNI}
            FiltroNombre={filtroNombre}
            setFiltroNombre={setFiltroNombre}
          />
        </div>
      )}

      {/* ----------- VISTA FORMULARIO (SIN CAMBIOS) ----------- */}
      {vista === "form" && (
        <div className="fade-in">
          <EmpleadosForm
            Empleado={empleadoEditando} 
            Guardar={handleGuardar}
            Cancelar={handleVolverDesdeForm}
          />

          <div className="text-center mt-4 mb-3">
            <button className="btn-secondary px-4" onClick={handleVolverDesdeForm}>
              <i className="fa-solid fa-arrow-left me-2"></i>
              {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}