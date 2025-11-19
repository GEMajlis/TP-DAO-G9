import "../../styles/PageLayout.css";

export default function Mantenimiento() {
  return (
    <div className="page-container">
      <h2 className="page-title">Mantenimiento de Vehículos</h2>
      <p className="page-subtitle">
        Llevá un registro completo de los mantenimientos realizados en la flota.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Ver historial de mantenimientos</h3>
          <p>Consultá los trabajos realizados sobre cada vehículo.</p>
          <button className="btn-primary">Ver historial</button>
        </div>

        <div className="page-card">
          <h3>Agregar mantenimiento</h3>
          <p>Registrá una nueva intervención o revisión técnica.</p>
          <button className="btn-primary">Registrar</button>
        </div>

        <div className="page-card">
          <h3>Próximos mantenimientos</h3>
          <p>Controlá las fechas planificadas de servicio preventivo.</p>
          <button className="btn-primary">Ver agenda</button>
        </div>
      </div>
    </div>
  );
}