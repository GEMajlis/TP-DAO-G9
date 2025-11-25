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

  const cargarVehiculos = async (numPagina = 1, pageSize = 5, aplicarFiltros = true) => {
    try {
      const filtroPatenteActual = aplicarFiltros ? filtroPatente : "";
      const filtroEstadoActual = aplicarFiltros ? filtroEstado : "";

      const data = await obtenerVehiculos(numPagina, pageSize, filtroPatenteActual, filtroEstadoActual);

      setVehiculos(data.vehiculos);
      if (!aplicarFiltros) setTodosLosVehiculos(data.vehiculos);

      setRegistrosTotal(data.total);
      setPaginas(Array.from({ length: data.total_pages }, (_, i) => i + 1));
      setPagina(data.page);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
      alert("No se pudieron cargar los vehículos.");
    }
  };

  useEffect(() => {
    cargarVehiculos(1, 5, false);
  }, []);

  useEffect(() => {
    cargarVehiculos(1);
  }, [filtroPatente, filtroEstado]);

  const handleAgregar = () => {
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
    if (!window.confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.patente}?`)) return;

    try {
      await eliminarVehiculo(vehiculo.patente);
      await cargarVehiculos(pagina, 5, false);
    } catch (err) {
      console.error("Error eliminando vehículo:", err);
      alert("No se pudo eliminar el vehículo.");
    }
  };

  const handleGuardar = async (vehiculoForm) => {
    try {
      if (vehiculoSeleccionado) {
        await actualizarVehiculo(vehiculoForm.patente, {
          patente: vehiculoForm.patente,
          color: vehiculoForm.color,
          marca: vehiculoForm.marca,
          modelo: vehiculoForm.modelo
        });
      } else {
        await crearVehiculo({
          patente: vehiculoForm.patente,
          color: vehiculoForm.color,
          marca: vehiculoForm.marca,
          modelo: vehiculoForm.modelo,
          estado: vehiculoForm.estado
        });
      }

      await cargarVehiculos(pagina, 5, false);
      setVista("lista");
    } catch (err) {
      console.error("Error guardando vehículo:", err);
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
            Agregar={handleAgregar}
            Pagina={pagina}
            RegistrosTotal={RegistrosTotal}
            Paginas={Paginas}
            Buscar={cargarVehiculos} 
            FiltroPatente={filtroPatente}
            setFiltroPatente={setFiltroPatente}
            FiltroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
          />
        </div>
      )}

      {vista === "form" && (
        <div className="fade-in">
          <VehiculosForm
            Vehiculo={vehiculoSeleccionado}
            Guardar={handleGuardar}
            Cancelar={handleVolverALista}
          />
        </div>
      )}
    </div>
  );
}
