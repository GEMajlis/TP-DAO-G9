import React, { useState, useEffect } from "react";
import ReservasList from "./ReservasList";
import ReservasForm from "./ReservasForm";
import "../../styles/PageLayout.css";

export default function ReservasPage() {
  const [vista, setVista] = useState("menu");

  // ----- INICIO DE CAMBIOS (Lógica de Filtro) -----
  const [todasLasReservas, setTodasLasReservas] = useState([]); // Base de datos completa
  const [reservas, setReservas] = useState([]); // Lista filtrada para mostrar
  const [filtroDNI, setFiltroDNI] = useState("");
  const [filtroPatente, setFiltroPatente] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  // ----- FIN DE CAMBIOS -----

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
    // ----- CAMBIO: Llenamos ambas listas -----
    setTodasLasReservas(datosSimulados);
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

  // ----- CAMBIO: handleCancelar debe actualizar ambas listas -----
  const handleCancelar = (reserva) => {
    if (window.confirm(`¿Estás seguro de que deseas CANCELAR la reserva ${reserva.IdReserva}?`)) {
      
      const logicaMap = (v) => 
        v.IdReserva === reserva.IdReserva 
          ? { ...v, Estado: "Cancelada" } 
          : v;

      setTodasLasReservas(prev => prev.map(logicaMap));
      setReservas(prev => prev.map(logicaMap));
    }
  };

  // ----- CAMBIO: Reemplazamos tu 'handleBuscar' por la versión con filtro -----
  const handleBuscar = (numPagina) => {
    setPagina(numPagina || 1);

    const resultado = todasLasReservas.filter((r) => {
      // Convertimos a string para búsquedas seguras
      const dniString = String(r.DNICliente);
      const patenteString = String(r.Patente);

      const cumpleDNI = dniString.toLowerCase().includes(filtroDNI.toLowerCase());
      const cumplePatente = patenteString.toLowerCase().includes(filtroPatente.toLowerCase());
      
      let cumpleEstado = true;
      if (filtroEstado !== "") {
        cumpleEstado = r.Estado === filtroEstado;
      }
      
      return cumpleDNI && cumplePatente && cumpleEstado;
    });

    setReservas(resultado);
  };

  // ----- CAMBIO: Lógica de guardado actualizada -----
  const handleGuardar = (reservaForm) => {
    let nuevaBase;
    if (reservaForm.IdReserva) { 
      // Modificando
      nuevaBase = todasLasReservas.map((v) => v.IdReserva === reservaForm.IdReserva ? reservaForm : v);
    } else { 
      // Agregando
      // (Simulamos un nuevo ID)
      const newId = Math.max(...todasLasReservas.map(r => r.IdReserva)) + 1;
      reservaForm.IdReserva = newId;
      nuevaBase = [...todasLasReservas, reservaForm];
    }

    setTodasLasReservas(nuevaBase);
    setReservas(nuevaBase);
    // Reseteamos filtros
    setFiltroDNI("");
    setFiltroPatente("");
    setFiltroEstado("");

    setVista("lista");
  };

  const handleVolverDesdeForm = () => {
    setVista(volverA);
  };

  return (
    // ESTA ESTRUCTURA DE RETURN ES LA TUYA ORIGINAL (que se ve bien)
    <div className="page-container">
      <h2 className="page-title">Gestión de reservas</h2>
      <p className="page-subtitle">
        Controlá el estado y los datos de cada reserva.
      </p>

      {/* ----------- VISTA MENÚ (SIN CAMBIOS) ----------- */}
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

      {/* ----------- VISTA LISTA (CON CAMBIOS) ----------- */}
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
            Paginas={[1]} // Ajustado a [1] (la paginación real no está implementada)
            Buscar={handleBuscar}
            Volver={() => setVista("menu")}

            // ----- INICIO DE CAMBIOS (Nuevas props) -----
            FiltroDNI={filtroDNI}
            setFiltroDNI={setFiltroDNI}
            FiltroPatente={filtroPatente}
            setFiltroPatente={setFiltroPatente}
            FiltroEstado={filtroEstado}
            setFiltroEstado={setFiltroEstado}
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
          <ReservasForm
            Reserva={reservaEditando} // Tu prop original
            Guardar={handleGuardar}
            Cancelar={handleVolverDesdeForm}
          />

          <div className="text-center mt-4 mb-3">
            <button className="btn btn-secondary px-4" onClick={handleVolverDesdeForm}>
              <i className="fa-solid fa.fa-arrow-left me-2"></i>
              {volverA === "menu" ? "Volver al menú" : "Volver al listado"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}