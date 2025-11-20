import React, { useState, useEffect } from "react";
import ReservasList from "./ReservasList";
import ReservasForm from "./ReservasForm";
import "../../styles/PageLayout.css";

export default function ReservasPage() {
  const [vista, setVista] = useState("menu");
  const [reservas, setReservas] = useState([]);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [volverA, setVolverA] = useState("menu");

  useEffect(() => {
    const datosSimulados = [
      { IdReserva: 1, DNICliente: 55669988, Patente: "ABC123", FechaInicio: "2024-07-01", FechaFin: "2024-07-10", Estado: "Activa" },
      { IdReserva: 2, DNICliente: 55223311, Patente: "DEF456", FechaInicio: "2024-07-05", FechaFin: "2024-07-15", Estado: "Exitosa" },
      { IdReserva: 3, DNICliente: 55447722, Patente: "GHI789", FechaInicio: "2024-07-10", FechaFin: "2024-07-20", Estado: "Activa" },
      { IdReserva: 4, DNICliente: 55990011, Patente: "JKL012", FechaInicio: "2024-07-15", FechaFin: "2024-07-25", Estado: "Fallida" },
    ];
    setReservas(datosSimulados);
  }, []);

  const handleAgregar = (origen) => {
    setReservaEditando(null);
    setVolverA(origen); 
    setVista("form");
  };

  const handleModificar = (reserva) => {
    setReservaEditando(reserva);
    setVolverA("lista"); 
    setVista("form");
  };

  const handleConsultar = (reserva) => {
    alert(`Consultando: ${reserva.IdReserva}`);
  };

  const handleCancelar = (reserva) => {
  if (window.confirm(`¿Estás seguro de que deseas CANCELAR la reserva ${reserva.IdReserva}?`)) {
    
    setReservas(prev => prev.map(v =>
      v.IdReserva === reserva.IdReserva 
        // 👇 Esta es la línea clave: siempre establece 'false'
        ? { ...v, Estado: "Cancelada" } 
        : v
    ));
  }
};


  const handleBuscar = (numPagina) => {
    setPagina(numPagina);
  };

  const handleGuardar = (reserva) => {
    console.log("Guardando:", reserva);
    if (reserva.IdReserva) {
      setReservas((prev) => prev.map((v) => v.IdReserva === reserva.IdReserva ? reserva : v));
    } else {
      reserva.IdReserva = reservas.length + 1;
      setReservas((prev) => [...prev, reserva]);
    }
    setVista("lista");
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de reservas</h2>
      <p className="page-subtitle">
        Controlá el estado y los datos de cada reserva.
      </p>

      {/* ----------- VISTA MENÚ ----------- */}
      {vista === "menu" && (
        <div className="page-content fade-in">
          <div className="page-card">
            <h3>Listado de reservas</h3>
            <p>Visualizá todas las reservas.</p>
            <button className="btn-primary" onClick={() => setVista("lista")}>Ver reservas</button>
          </div>

          <div className="page-card">
            <h3>Agregar reserva</h3>
            <p>Cargá una nueva reserva.</p>
            <button className="btn-primary" onClick={() => handleAgregar("menu")}>Agregar</button>
          </div>
        </div>
      )}

      {/* ----------- VISTA LISTA ----------- */}
      {vista === "lista" && (
        <div className="fade-in">
          <ReservasList
            Reservas={reservas}
            Consultar={handleConsultar}
            Modificar={handleModificar}
            Cancelar={handleCancelar}
            Agregar={() => handleAgregar("lista")}
            Pagina={pagina}
            RegistrosTotal={reservas.length}
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
          <ReservasForm
            Reserva={reservaEditando}
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