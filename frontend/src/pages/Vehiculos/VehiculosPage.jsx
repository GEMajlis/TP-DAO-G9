import React, { useState, useEffect } from "react";
import VehiculosList from "./VehiculosList";
import VehiculosForm from "./VehiculosForm";
import "../../styles/PageLayout.css";
import { obtenerVehiculos, obtenerVehiculo, crearVehiculo, actualizarVehiculo, eliminarVehiculo } from "../../services/vehiculosService";

export default function VehiculosPage() {
  const [vista, setVista] = useState("lista");

  const [todosLosVehiculos, setTodosLosVehiculos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [RegistrosTotal, setRegistrosTotal] = useState(0); 
  const [Paginas, setPaginas] = useState([]);

  const [filtroPatente, setFiltroPatente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const data = await obtenerVehiculos(1, 5); 

      setVehiculos(data.vehiculos);
      setTodosLosVehiculos(data.vehiculos);

      setRegistrosTotal(data.total);
      setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
      setPagina(data.page);

    } catch (err) {
      console.error("Error cargando vehículos:", err);
      alert("No se pudieron cargar los vehículos.");
    }
  };

  const handleBuscar = async (numPagina = 1) => {
    try {
      setPagina(numPagina);

      const data = await obtenerVehiculos(numPagina, 5); 

      setVehiculos(data.vehiculos);
      setRegistrosTotal(data.total);
      setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));

    } catch (err) {
      console.error("Error filtrando o paginando vehículos:", err);
    }
  };

  const handleAgregar = (origen) => {
    setVehiculoSeleccionado(null);
    setVista("form");
  };

  const handleModificar = async (vehiculo) => {
    try {
      const data = await obtenerVehiculo(vehiculo.patente);
      setVehiculoSeleccionado(data);
      setVista("form");
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar el vehículo.");
    }
  };
 

  const handleEliminar = (vehiculo) => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.Patente}?`)) {
      setTodosLosVehiculos(prev => prev.filter(v => v.Patente !== vehiculo.Patente));
      setVehiculos(prev => prev.filter(v => v.Patente !== vehiculo.Patente));
    }
  };

  const handleGuardar = async (vehiculoForm) => {
    const existe = todosLosVehiculos.some(v => v.Patente === vehiculoForm.Patente);

    let nuevaBase;
    if (vehiculoSeleccionado) {
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


  const handleVolverALista = () => {
    setVista("lista");
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Vehículos</h2>
      <p className="page-subtitle">
        Accedé a la información clave de cada vehículo y mantené la operación siempre en movimiento.
      </p>

      {vista === "lista" && (
        <div className="fade-in">
          <VehiculosList
            Vehiculos={vehiculos}
            Modificar={handleModificar}
            Eliminar={handleEliminar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={RegistrosTotal}
            Paginas={Paginas}
            Buscar={handleBuscar}
            FiltroPatente={filtroPatente}
            setFiltroPatente={setFiltroPatente}
            FiltroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
          />
          {/* <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={() => window.location.href = "/"}>
              <i className="fa-solid fa-arrow-left me-2"></i>Volver al menú
            </button>
          </div> */}
        </div>
      )}

      {vista === "form" && (
        <div className="fade-in">
          <VehiculosForm
            Vehiculo={vehiculoSeleccionado}
            Guardar={handleGuardar}
            Cancelar={handleVolverALista}
          />
          {/* <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={handleVolverALista}>
              <i className="fa-solid fa-arrow-left me-2"></i>
              {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}