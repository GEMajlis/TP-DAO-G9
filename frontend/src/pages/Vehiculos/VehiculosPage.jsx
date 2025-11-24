import React, { useState, useEffect, useCallback } from "react";
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

  const cargarVehiculos = useCallback(async (paginaActual = 1) => {
    try {
      const data = await obtenerVehiculos(paginaActual, 5, filtroPatente, filtroEstado);

      setVehiculos(data.vehiculos);

      setRegistrosTotal(data.total);
      setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
      setPagina(data.page);

    } catch (err) {
      console.error("Error cargando vehículos:", err);
      alert("No se pudieron cargar los vehículos.");
    }
  }, [filtroPatente, filtroEstado]);

  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  const handleBuscar = async (numPagina = 1) => {
    try {
      setPagina(numPagina);

      const data = await obtenerVehiculos(numPagina, 5, filtroPatente, filtroEstado);

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
      const vehiculoData = data.vehiculos?.[0] || data;
      setVehiculoSeleccionado(vehiculoData);
      setVista("form");
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar el vehículo.");
    }
  };
 

  const handleEliminar = async (vehiculo) => {
    if (window.confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.patente}?`)) {
      try {
        await eliminarVehiculo(vehiculo.patente);
        await cargarVehiculos(); 
      } catch (err) {
        console.error("Error eliminando vehículo:", err);
        alert("No se pudo eliminar el vehículo.");
      }
    }
  };

  const handleGuardar = async (vehiculoForm) => {
    try {
      if (vehiculoSeleccionado) {
        const dataToSend = {
          patente: vehiculoForm.patente,
          color: vehiculoForm.color,
          marca: vehiculoForm.marca,
          precio_por_dia: vehiculoForm.precio_por_dia,
          modelo: vehiculoForm.modelo,
          estado: vehiculoForm.estado
        };
        await actualizarVehiculo(vehiculoForm.patente, dataToSend);
        await cargarVehiculos(pagina); // ← CAMBIO: Mantener página actual
      } else {
        const dataToSend = {
          patente: vehiculoForm.patente,
          color: vehiculoForm.color,
          marca: vehiculoForm.marca,
          modelo: vehiculoForm.modelo,
          precio_por_dia: vehiculoForm.precio_por_dia,
          estado: vehiculoForm.estado
        };
        await crearVehiculo(dataToSend);
        await cargarVehiculos(1); // ← CAMBIO: Para nuevos vehículos ir a página 1
      }

      setVista("lista");
    } catch (err) {
      console.error("Error guardando vehículo:", err);
      console.error("Error completo:", err.response?.data);
      alert(err.message || "No se pudo guardar el vehículo.");
    }
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