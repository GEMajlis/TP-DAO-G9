import React, { useState, useEffect } from "react";
import ClientesList from "./ClientesList";
import ClientesForm from "./ClientesForm";
import "../../styles/PageLayout.css";

export default function ClientesPage() {
  const [vista, setVista] = useState("menu");
  
  // ----- INICIO DE CAMBIOS (Lógica de Filtro) -----
  const [todosLosClientes, setTodosLosClientes] = useState([]); // Base de datos completa
  const [clientes, setClientes] = useState([]); // Lista filtrada para mostrar
  const [filtroDNI, setFiltroDNI] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  // ----- FIN DE CAMBIOS -----

  const [clienteEditando, setClienteEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");

  useEffect(() => {
    const datosSimulados = [
      { DNI: "12345678", Nombre: "Juan", Apellido: "Perez", Email: "juan@mail.com", Telefono: "11223344" },
      { DNI: "87654321", Nombre: "Maria", Apellido: "Gomez", Email: "maria@mail.com", Telefono: "55667788" },
      { DNI: "11223344", Nombre: "Carlos", Apellido: "Lopez", Email: "carlos@mail.com", Telefono: "99001122" },
    ];
    // ----- CAMBIO: Llenamos ambas listas -----
    setTodosLosClientes(datosSimulados); 
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

  // (Mantenemos tu 'handleConsultar' por si ClientesList lo usa)
  const handleConsultar = (cliente) => {
    alert(`Consultando: ${cliente.DNI}`);
  };

  const handleEliminar = (cliente) => {
    if (window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.Nombre} ${cliente.Apellido}?`)) {
      // ----- CAMBIO: Actualizamos ambas listas -----
      setTodosLosClientes(prev => prev.filter(c => c.DNI !== cliente.DNI));
      setClientes(prev => prev.filter(c => c.DNI !== cliente.DNI));
    }
  };

  // ----- CAMBIO: Reemplazamos tu 'handleBuscar' por la versión con filtro -----
  const handleBuscar = (numPagina) => {
    setPagina(numPagina || 1);

    const resultado = todosLosClientes.filter((c) => {
      const cumpleDNI = c.DNI.toLowerCase().includes(filtroDNI.toLowerCase());
      const cumpleNombre = c.Nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      return cumpleDNI && cumpleNombre;
    });

    setClientes(resultado);
  };

  const handleGuardar = (clienteForm) => {
    let nuevaBase;
    if (clienteEditando) { 
      // Modificando
      nuevaBase = todosLosClientes.map((c) => (c.DNI === clienteForm.DNI ? clienteForm : c));
    } else {
      // Agregando
      const existe = todosLosClientes.some(c => c.DNI === clienteForm.DNI);
      if (existe) {
        alert("Ya existe un cliente con ese DNI.");
        return;
      }
      nuevaBase = [...todosLosClientes, clienteForm];
    }

    // ----- CAMBIO: Actualizamos ambas listas y reseteamos filtros -----
    setTodosLosClientes(nuevaBase);
    setClientes(nuevaBase);
    setFiltroDNI("");
    setFiltroNombre("");
    setVista("lista");
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  return (
    // ESTA ESTRUCTURA DE RETURN ES LA DE TU CÓDIGO "VIEJO" (que se ve bien)
    <div className="page-container">
      <h2 className="page-title">Gestión de clientes</h2>
      <p className="page-subtitle">
        Controlá clientes.
      </p>

      {/* ----------- VISTA MENÚ (SIN CAMBIOS) ----------- */}
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

      {/* ----------- VISTA LISTA (CON CAMBIOS) ----------- */}
      {vista === "lista" && (
        <div className="fade-in">
          <ClientesList
            Clientes={clientes}
            Consultar={handleConsultar} // (Dejamos tus props originales)
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={clientes.length}
            Paginas={[1]} // (Lo ajusté a [1] como en Vehiculos, ya que la paginación no está implementada)
            Buscar={handleBuscar}
            Volver={() => setVista("menu")} // (Dejamos tus props originales)

            // ----- INICIO DE CAMBIOS (Nuevas props) -----
            FiltroDNI={filtroDNI}
            setFiltroDNI={setFiltroDNI}
            FiltroNombre={filtroNombre}
            setFiltroNombre={setFiltroNombre}
            // ----- FIN DE CAMBIOS -----
          />

          <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={() => setVista("menu")}>
              <i className="fa-solid fa-arrow-left me-2"></i>Volver al menú
            </button>
          </div>
        </div>
      )}

      {/* ----------- VISTA FORMULARIO (SIN CAMBIOS) ----------- */}
      {vista === "form" && (
        <div className="fade-in">
          <ClientesForm
            cliente={clienteEditando} // (Usa 'cliente' como en tu código viejo)
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