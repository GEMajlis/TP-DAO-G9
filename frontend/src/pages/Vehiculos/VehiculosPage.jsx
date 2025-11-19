import React, { useState, useEffect } from "react";
import VehiculosList from "./VehiculosList";
import VehiculosForm from "./VehiculosForm";
import "../../styles/PageLayout.css";

export default function VehiculosPage() {
  const [vista, setVista] = useState("menu");

  // DATOS: Separamos "Todos" (Base) de "Vehiculos" (Filtrados para mostrar)
  const [todosLosVehiculos, setTodosLosVehiculos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");

  // ESTADOS DEL FILTRO
  const [filtroPatente, setFiltroPatente] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("");

  useEffect(() => {
    const datosSimulados = [
      { IdVehiculo: 1, Patente: "AB123CD", Marca: "Toyota", Modelo: "Corolla", Anio: 2022, Activo: true },
      { IdVehiculo: 2, Patente: "AE555EE", Marca: "Ford", Modelo: "Ranger", Anio: 2021, Activo: true },
      { IdVehiculo: 3, Patente: "ZZ999XX", Marca: "Fiat", Modelo: "Cronos", Anio: 2023, Activo: false },
    ];
    setTodosLosVehiculos(datosSimulados);
    setVehiculos(datosSimulados); // Al inicio mostramos todo
  }, []);

  // LÓGICA DE BÚSQUEDA Y FILTRADO
  const handleBuscar = (numPagina) => {
    setPagina(numPagina || 1);

    // Filtramos sobre la base completa
    const resultado = todosLosVehiculos.filter((v) => {
      const cumplePatente = v.Patente.toLowerCase().includes(filtroPatente.toLowerCase());
      let cumpleActivo = true;
      if (filtroActivo !== "") {
        const esActivo = filtroActivo === "true";
        cumpleActivo = v.Activo === esActivo;
      }
      return cumplePatente && cumpleActivo;
    });

    setVehiculos(resultado);
  };

  const handleAgregar = (origen) => {
    setVehiculoEditando(null);
    setVolverA(origen);
    setVista("form");
  };

  const handleModificar = (vehiculo) => {
    setVehiculoEditando(vehiculo);
    setVolverA("lista");
    setVista("form");
  };

  const handleConsultar = (vehiculo) => {
    alert(`Consultando: ${vehiculo.Patente}`);
  };

  const handleActivarDesactivar = (vehiculo) => {
    const nuevoEstado = !vehiculo.Activo;

    // Actualizamos la base
    const baseActualizada = todosLosVehiculos.map(v =>
      v.IdVehiculo === vehiculo.IdVehiculo ? { ...v, Activo: nuevoEstado } : v
    );
    setTodosLosVehiculos(baseActualizada);

    // Actualizamos la vista filtrada actual
    setVehiculos(prev => prev.map(v =>
      v.IdVehiculo === vehiculo.IdVehiculo ? { ...v, Activo: nuevoEstado } : v
    ));
  };

  const handleEliminar = (vehiculo) => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.Patente}?`)) {
      // Borramos de la base
      setTodosLosVehiculos(prev => prev.filter(v => v.IdVehiculo !== vehiculo.IdVehiculo));
      // Borramos de la vista
      setVehiculos(prev => prev.filter(v => v.IdVehiculo !== vehiculo.IdVehiculo));
    }
  };

  const handleGuardar = (vehiculo) => {
    console.log("Guardando:", vehiculo);
    let nuevaBase;

    if (vehiculo.IdVehiculo) {
      // Editar
      nuevaBase = todosLosVehiculos.map((v) => v.IdVehiculo === vehiculo.IdVehiculo ? vehiculo : v);
    } else {
      // Nuevo
      vehiculo.IdVehiculo = todosLosVehiculos.length > 0 ? Math.max(...todosLosVehiculos.map(v => v.IdVehiculo)) + 1 : 1;
      nuevaBase = [...todosLosVehiculos, vehiculo];
    }

    setTodosLosVehiculos(nuevaBase);
    setVehiculos(nuevaBase); // Reseteamos filtro al guardar para ver el cambio

    // Limpiamos los campos del filtro
    setFiltroPatente("");
    setFiltroActivo("");

    setVista("lista");
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Vehículos</h2>
      <p className="page-subtitle">
        Controlá el estado, modelo y disponibilidad de cada vehículo.
      </p>

      {/* ----------- VISTA MENÚ ----------- */}
      {vista === "menu" && (
        <div className="page-content fade-in">
          <div className="page-card">
            <h3>Listado de vehículos</h3>
            <p>Visualizá toda la flota.</p>
            <button className="btn-primary" onClick={() => setVista("lista")}>Ver flota</button>
          </div>

          <div className="page-card">
            <h3>Agregar vehículo</h3>
            <p>Cargá un nuevo vehículo.</p>
            <button className="btn-primary" onClick={() => handleAgregar("menu")}>Agregar</button>
          </div>
        </div>
      )}

      {/* ----------- VISTA LISTA ----------- */}
      {vista === "lista" && (
        <div className="fade-in">
          <VehiculosList
            Vehiculos={vehiculos}
            Consultar={handleConsultar}
            Modificar={handleModificar}
            ActivarDesactivar={handleActivarDesactivar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={vehiculos.length}
            Paginas={[1]}
            Buscar={handleBuscar}

            // Props para el Filtro
            FiltroPatente={filtroPatente}
            setFiltroPatente={setFiltroPatente}
            FiltroActivo={filtroActivo}
            setFiltroActivo={setFiltroActivo}

            Volver={() => setVista("menu")}
          />
        </div>
      )}

      {/* ----------- VISTA FORMULARIO ----------- */}
      {vista === "form" && (
        <div className="fade-in">
          <VehiculosForm
            Vehiculo={vehiculoEditando}
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