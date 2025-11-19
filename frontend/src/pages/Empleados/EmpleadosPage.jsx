import React, { useState, useEffect } from "react";
import EmpleadosList from "./EmpleadosList";
import EmpleadosForm from "./EmpleadosForm";
import "../../styles/PageLayout.css";

export default function EmpleadosPage() {
  const [vista, setVista] = useState("menu");
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");

  useEffect(() => {
    const datosSimulados = [
      { DNI: 55669988, Nombre: "Luis", Apellido: "Dominguez" },
      { DNI: 44778855, Nombre: "Gustavo", Apellido: "Amaya" },
      { DNI: 55882211, Nombre: "Leonel", Apellido: "Diaz" },
    ];
    setEmpleados(datosSimulados);
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


  const handleEliminar = (empleado) => {
    if (window.confirm(`¿Estás seguro de eliminar el empleado ${empleado.DNI}?`)) {
      setEmpleados(prev => prev.filter(v => v.DNI !== empleado.DNI));
    }
  };

  const handleBuscar = (numPagina) => {
    setPagina(numPagina);
  };

  const handleGuardar = (empleado) => {
    console.log("Guardando:", empleado);
    if (empleado.DNI) {
      setEmpleados((prev) => prev.map((v) => v.DNI === empleado.DNI ? empleado : v));
    } else {
      empleado.DNI = empleados.length + 1;
      setEmpleados((prev) => [...prev, empleado]);
    }
    setVista("lista");
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Empleados</h2>
      <p className="page-subtitle">
        Controlá empleados.
      </p>

      {/* ----------- VISTA MENÚ ----------- */}
      {vista === "menu" && (
        <div className="page-content fade-in">
          <div className="page-card">
            <h3>Listado de empleados</h3>
            <p>Visualizá todos los empleados.</p>
            <button className="btn-primary" onClick={() => setVista("lista")}>Ver empleados</button>
          </div>

          <div className="page-card">
            <h3>Agregar empleado</h3>
            <p>Cargá un nuevo empleado.</p>
            <button className="btn-primary" onClick={() => handleAgregar("menu")}>Agregar</button>
          </div>
        </div>
      )}

      {/* ----------- VISTA LISTA ----------- */}
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
            Paginas={[1, 2, 3]}
            Buscar={handleBuscar}
            Volver={() => setVista("menu")}
          />

          <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={() => setVista("menu")}>
              <i className="fa-solid fa-arrow-left me-2"></i>Volver al menú
            </button>
          </div>
        </div>
      )}

      {/* ----------- VISTA FORMULARIO ----------- */}
      {vista === "form" && (
        <div className="fade-in">
          <EmpleadosForm
            Empleado={empleadoEditando}
            Guardar={handleGuardar}
            Cancelar={handleVolverDesdeForm}
          />

          <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={handleVolverDesdeForm}>
              <i className="fa-solid fa-arrow-left me-2"></i>
              {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}