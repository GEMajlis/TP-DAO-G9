import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerVehiculos } from '../services/vehiculosService';
import { obtenerAlquileres } from '../services/alquileresService'; 
import { getClientes } from '../services/clientesService'; 
import { getReservasHoy } from '../services/reservasService'; 
import { obtenerActivos } from '../services/mantenimientosService'; 
import '../styles/Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();
  const hoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const [kpiData, setKpiData] = useState({
    alquileresActivos: 0,
    alquileresFinalizados: 0,
    totalVehiculos: 0,
    vehiculosDisponibles: 0,
    totalClientes: 0,
    totalReservas: 0, 
    totalMantenimientosActivos: 0
  });

  useEffect(() => {
    const cargarDatosDashboard = async () => {
      try {
        const dataVehiculos = await obtenerVehiculos(1, 1000);
        const totalAutos = dataVehiculos.total || 0;
        const autosDisponibles = dataVehiculos.vehiculos
          ? dataVehiculos.vehiculos.filter(v => v.estado === 'disponible').length
          : 0;

        const dataAlquileresActivos = await obtenerAlquileres(1, 1000, "","Activo");
        const alquileresActivos = dataAlquileresActivos.total || 0;
        const dataAlquileresFinalizados = await obtenerAlquileres(1, 1000, "", "Finalizado");
        const finalizados = dataAlquileresFinalizados.total || 0;

        const dataClientes = await getClientes();
        const clientesRegistrados = dataClientes.length || 0;

        const dataReservasHoy = await getReservasHoy();
        const reservasHoy = dataReservasHoy.length || 0;

        const dataMantenimientosActivos = await obtenerActivos();
        const mantenimientosActivos = dataMantenimientosActivos.length || 0;

        setKpiData({
          alquileresActivos: alquileresActivos,
          alquileresFinalizados: finalizados,
          totalVehiculos: totalAutos,
          vehiculosDisponibles: autosDisponibles,
          totalClientes: clientesRegistrados,
          totalReservas: reservasHoy,
          totalMantenimientosActivos: mantenimientosActivos
        });

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    cargarDatosDashboard();
  }, []);

  const porcentajeDisponibilidad = kpiData.totalVehiculos > 0
    ? Math.round((kpiData.vehiculosDisponibles / kpiData.totalVehiculos) * 100)
    : 0;

  return (
    <div className="dashboard-container">

      {/* --- HEADER DEL DASHBOARD --- */}
      <header className="dashboard-header">
        <div className="welcome-text">
          <p className="text-uppercase fw-bold text-secondary small mb-1">{hoy}</p>
          <h1>Hola,</h1>
          <p>Aquí tienes el resumen de AutoRenta hoy.</p>
        </div>
        <div>
          <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate('/alquileres')}>
            <i className="fa-solid fa-plus me-2"></i> Nuevo Alquiler
          </button>
        </div>
      </header>

      {/* --- BENTO GRID --- */}
      <div className="bento-grid">

        {/* 1. ALQUILERES */}
        <div className="bento-item span-2 row-2" onClick={() => navigate('/alquileres')}>
          <div>
            <div className="widget-title"><i className="fa-solid fa-file-contract text-primary"></i> Gestión de Alquileres</div>
            <p className="text-muted mt-2">Controla contratos activos, vencimientos y devoluciones.</p>
            <div className="d-flex gap-4 mt-4">
              <div>
                <div className="widget-value text-success">{kpiData.alquileresActivos}</div>
                <div className="widget-desc">Activos</div>
              </div>
              <div>
                <div className="widget-value text-warning">{kpiData.alquileresFinalizados}</div>
                <div className="widget-desc">Finalizados</div>
              </div>
            </div>
          </div>
          <button className="action-btn mt-4">Ir a Alquileres <i className="fa-solid fa-arrow-right ms-1"></i></button>
          <i className="fa-solid fa-file-signature bg-icon"></i>
        </div>

        {/* 2. FLOTA */}
        <div className="bento-item" onClick={() => navigate('/vehiculos')}>
          <div className="widget-title"><i className="fa-solid fa-car text-info"></i> Flota</div>
          <div className="widget-value">{kpiData.totalVehiculos}</div>
          <div className="widget-desc">Vehículos totales</div>
          <div className="progress mt-2" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-info"
              style={{ width: `${porcentajeDisponibilidad}%` }}
            ></div>
          </div>
          <div className="widget-desc small mt-1">{porcentajeDisponibilidad}% Disponible ({kpiData.vehiculosDisponibles} autos)</div>
        </div>

        {/* 3. CLIENTES */}
        <div className="bento-item" onClick={() => navigate('/clientes')}>
          <div className="widget-title"><i className="fa-solid fa-users text-success"></i> Clientes</div>
          <div className="widget-value">{kpiData.totalClientes}</div>
          <div className="widget-desc">Registrados</div>
          <i className="fa-solid fa-user-group bg-icon" style={{ fontSize: '5rem', bottom: '-15px' }}></i>
        </div>

        {/* 4. RESERVAS */}
        <div className="bento-item span-2" onClick={() => navigate('/reservas')}>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="widget-title"><i className="fa-solid fa-calendar-check text-danger"></i> Reservas para hoy</div>
              <h4 className="mt-2 mb-0 fw-bold">
                {kpiData.totalReservas} {kpiData.totalReservas === 1 ? 'Reserva' : 'Reservas'}
              </h4>
            </div>
            <div className="bg-light rounded p-2 text-center" style={{ minWidth: '60px' }}>
              <span className="d-block fw-bold text-danger">HOY</span>
              <span className="h4 fw-bold d-block mb-0">{new Date().getDate()}</span>
            </div>
          </div>
        </div>

        {/* 5. MANTENIMIENTOS */}
        <div className="bento-item" onClick={() => navigate('/mantenimiento')}>
          <div className="widget-title"><i className="fa-solid fa-wrench text-secondary"></i> Taller</div>
          <div className="d-flex align-items-center gap-2 mt-2">
            <span className="badge bg-warning text-dark rounded-pill">{kpiData.totalMantenimientosActivos} En reparación</span>
          </div>
          <div className="widget-desc mt-2">Ver estado de flota</div>
        </div>

        {/* 6. MULTAS, DAÑOS Y EMPLEADOS */}
        <div className="bento-item d-flex align-items-center justify-content-center flex-column text-center" onClick={() => navigate('/multas')}>
          <i className="fa-solid fa-file-invoice-dollar fa-2x text-danger mb-2"></i>
          <span className="fw-bold text-secondary">Multas</span>
        </div>

        <div className="bento-item d-flex align-items-center justify-content-center flex-column text-center" onClick={() => navigate('/danios')}>
          <i className="fa-solid fa-car-burst fa-2x text-warning mb-2"></i>
          <span className="fw-bold text-secondary">Daños</span>
        </div>

        <div className="bento-item" onClick={() => navigate('/empleados')}>
          <div className="widget-title"><i className="fa-solid fa-id-card"></i> Staff</div>
          <div className="widget-desc">Gestión de personal y accesos.</div>
        </div>

        {/* 7. REPORTES */}
        <div className="bento-item span-3" style={{ background: '#0b3d5e', color: 'white', border: 'none' }} onClick={() => navigate('/reportes')}>
          <div className="d-flex justify-content-between align-items-center h-100">
            <div>
              <div className="widget-title text-white-50"><i className="fa-solid fa-chart-line"></i> Reportes</div>
              <h3 className="fw-bold mb-1">Estadísticas Mensuales</h3>
              <p className="text-white-50 small mb-0">Ver rendimiento financiero</p>
            </div>
            <div className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px' }}>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* 9. IMAGEN */}
        <div
          className="bento-item d-flex align-items-center justify-content-center no-hover"
          style={{overflow: "hidden", padding: 0, cursor: "default"}}
        >
          <img src="rent.png" alt="Decoración"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px"}}
          />
        </div>

      </div>
    </div>
  );
}