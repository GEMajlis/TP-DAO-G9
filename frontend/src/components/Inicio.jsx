import React from 'react';

function Inicio() {
  return (
    <div className="container mt-5">
      {/* Sección principal del Héroe */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          <div 
            className="p-5 text-center text-white rounded-3 shadow-lg"
            style={{
              backgroundColor: '#00aeff', // El color principal de tus botones
              backgroundImage: 'linear-gradient(135deg, #00aeff 0%, #007bff 100%)',
            }}
          >
            <h1 className="display-4 fw-bold">Sistema de Gestión de Alquiler de Vehículos (G9)</h1>
            <p className="lead mt-3 mb-4">
              La plataforma integral para administrar clientes, la flota vehicular, reservas y el flujo completo de alquileres y mantenimiento.
            </p>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <button 
                type="button" 
                className="btn btn-light btn-lg px-4"
                onClick={() => alert('Simular Navegación a Búsqueda de Vehículos')}
              >
                <i className="fa fa-car me-2"></i> Buscar Vehículos
              </button>
              <button 
                type="button" 
                className="btn btn-outline-light btn-lg px-4"
                onClick={() => alert('Simular Navegación a Registro de Cliente')}
              >
                <i className="fa fa-user-plus me-2"></i> Registrar Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Título de la sección de características */}
      <h2 className="text-center mb-4 text-primary fw-bold">Nuestros Módulos Clave de Gestión</h2>
      <p className="text-center text-muted mb-5">Control total sobre el ciclo de vida del alquiler y los recursos de la empresa.</p>

      {/* Sección de Características (Basado en Alcances) */}
      <div className="row g-4">
        
        {/* Tarjeta 1: Clientes y Empleados */}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-primary">
            <div className="card-body text-center">
              <i className="fa fa-users fa-3x text-primary mb-3"></i>
              <h5 className="card-title fw-bold">ABMC de Personas</h5>
              <p className="card-text text-muted">
                Gestión completa de altas, bajas, modificaciones y consultas de Clientes y Empleados.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Vehículos y Flota */}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-info">
            <div className="card-body text-center">
              <i className="fa fa-wrench fa-3x text-info mb-3"></i>
              <h5 className="card-title fw-bold">Mantenimiento y Control</h5>
              <p className="card-text text-muted">
                Registro del estado de los vehículos, mantenimiento, multas y daños asociados al alquiler.
              </p>
            </div>
          </div>
        </div>
        
        {/* Tarjeta 3: Alquiler y Reservas */}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body text-center">
              <i className="fa fa-calendar-check fa-3x text-success mb-3"></i>
              <h5 className="card-title fw-bold">Control de Transacciones</h5>
              <p className="card-text text-muted">
                Registro del inicio y fin de alquileres, reservas anticipadas y cálculo automático de costos.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Reportes y Estadísticas */}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-warning">
            <div className="card-body text-center">
              <i className="fa fa-chart-bar fa-3x text-warning mb-3"></i>
              <h5 className="card-title fw-bold">Reportes de Facturación</h5>
              <p className="card-text text-muted">
                Generación de estadísticas de facturación mensual y reportes detallados (vehículos más alquilados, historial por cliente).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nota importante */}
      <div className="mt-5 text-center p-3 border-top">
        <p className="text-muted small">
          <i className="fa fa-lock me-1"></i> Recuerda: La mayoría de las secciones requieren **Inicio de Sesión** de Empleado para acceder.
        </p>
      </div>

    </div>
  );
}

export { Inicio }; // Usamos export nombrado para seguir la convención de tu App.js