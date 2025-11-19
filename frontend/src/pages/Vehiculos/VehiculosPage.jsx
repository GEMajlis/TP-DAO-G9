import React, { useState, useEffect } from "react";
import VehiculosList from "./VehiculosList";
import VehiculosForm from "./VehiculosForm";
import "../../styles/PageLayout.css";

export default function VehiculosPage() {
  const [vista, setVista] = useState("menu");
  const [todosLosVehiculos, setTodosLosVehiculos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");
  const [filtroPatente, setFiltroPatente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    const datosSimulados = [
      { Patente: "AB123CD", Marca: "Toyota", Modelo: "Corolla", Color: "Negro", Estado: "Disponible" },
      { Patente: "AE555EE", Marca: "Ford", Modelo: "Ranger", Color: "Rojo", Estado: "Alquilado" },
      { Patente: "ZZ999XX", Marca: "Fiat", Modelo: "Cronos", Color: "Blanco", Estado: "En Mantenimiento" },
    ];
    setTodosLosVehiculos(datosSimulados);
    setVehiculos(datosSimulados);
  }, []);

  const handleBuscar = (numPagina) => {
    setPagina(numPagina || 1);

    const resultado = todosLosVehiculos.filter((v) => {
    const cumplePatente = v.Patente.toLowerCase().includes(filtroPatente.toLowerCase());
    let cumpleEstado = true;
    if (filtroEstado !== "") {
      cumpleEstado = v.Estado === filtroEstado;
    }
    return cumplePatente && cumpleEstado;
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

  const handleEliminar = (vehiculo) => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.Patente}?`)) {
      setTodosLosVehiculos(prev => prev.filter(v => v.Patente !== vehiculo.Patente));
      setVehiculos(prev => prev.filter(v => v.Patente !== vehiculo.Patente));
    }
  };

  const handleGuardar = (vehiculoForm) => {
    const existe = todosLosVehiculos.some(v => v.Patente === vehiculoForm.Patente);

    let nuevaBase;
    if (vehiculoEditando) {
      nuevaBase = todosLosVehiculos.map((v) => v.Patente === vehiculoForm.Patente ? vehiculoForm : v);
    } else {
      if (existe) {
        alert("Ya existe un vehículo con esa Patente.");
        return;
      }
      nuevaBase = [...todosLosVehiculos, vehiculoForm];
    }

    setTodosLosVehiculos(nuevaBase);
    setVehiculos(nuevaBase);
    setFiltroPatente("");
    setFiltroEstado("");
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

      {vista === "lista" && (
        <div className="fade-in">
          <VehiculosList
            Vehiculos={vehiculos}
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={vehiculos.length}
            Paginas={[1]}
            Buscar={handleBuscar}
            FiltroPatente={filtroPatente}
            setFiltroPatente={setFiltroPatente}
            FiltroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
            Volver={() => setVista("menu")}
          />
          <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={() => setVista("menu")}>
              <i className="fa-solid fa-arrow-left me-2"></i>Volver al menú
            </button>
          </div>
        </div>
      )}

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