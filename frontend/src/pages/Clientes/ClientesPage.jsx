import React, { useState, useEffect } from "react";
import ClientesList from "./ClientesList";
import ClientesForm from "./ClientesForm";
import "../../styles/PageLayout.css";

export default function ClientesPage() {
  const [vista, setVista] = useState("menu");
  const [clientes, setClientes] = useState([]);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");

  useEffect(() => {
    const datosSimulados = [
      { DNI: 55669988, Nombre: "Luis", Apellido: "Dominguez", Telefono: 3515566896 },
      { DNI: 44778855, Nombre: "Gustavo", Apellido: "Amaya", Telefono: 3512233112 },
      { DNI: 55882211, Nombre: "Leonel", Apellido: "Diaz", Telefono: 3516699332 },
    ];
    setClientes(datosSimulados);
  }, []);

  const handleAgregar = (origen) => {
    setClienteEditando(null);
    setVolverA(origen); 
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


  const handleEliminar = (cliente) => {
    if (window.confirm(`¿Estás seguro de eliminar el cliente ${cliente.DNI}?`)) {
      setClientes(prev => prev.filter(v => v.DNI !== cliente.DNI));
    }
  };

  const handleBuscar = (numPagina) => {
    setPagina(numPagina);
  };

  const handleGuardar = (cliente) => {
    console.log("Guardando:", cliente);
    if (cliente.DNI) {
      setClientes((prev) => prev.map((v) => v.DNI === cliente.DNI ? cliente : v));
    } else {
      cliente.DNI = clientes.length + 1;
      setClientes((prev) => [...prev, cliente]);
    }
    setVista("lista");
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de clientes</h2>
      <p className="page-subtitle">
        Controlá clientes.
      </p>

      {/* ----------- VISTA MENÚ ----------- */}
      {vista === "menu" && (
        <div className="page-content fade-in">
          <div className="page-card">
            <h3>Listado de clientes</h3>
            <p>Visualizá todos los clientes.</p>
            <button className="btn-primary" onClick={() => setVista("lista")}>Ver clientes</button>
          </div>

          <div className="page-card">
            <h3>Agregar cliente</h3>
            <p>Cargá un nuevo cliente.</p>
            <button className="btn-primary" onClick={() => handleAgregar("menu")}>Agregar</button>
          </div>
        </div>
      )}

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
          <ClientesForm
            cliente={clienteEditando}
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