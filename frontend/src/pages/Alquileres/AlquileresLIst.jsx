import '../../styles/PageLayout.css';
export default function Alquileres() {
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Alquileres</h2>
      <p className="page-subtitle">
        Controlá los contratos de alquiler, costos y estados de cada operación.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Ver alquileres activos</h3>
          <p>Revisá los contratos vigentes y sus detalles.</p>
          <button className="btn-primary">Ver alquileres</button>
        </div>

        <div className="page-card">
          <h3>Iniciar nuevo alquiler</h3>
          <p>Asigná un vehículo y cliente para comenzar un nuevo alquiler.</p>
          <button className="btn-primary">Nuevo alquiler</button>
        </div>

        <div className="page-card">
          <h3>Finalizar alquiler</h3>
          <p>Registrá la devolución del vehículo y cerrá el contrato.</p>
          <button className="btn-primary">Finalizar</button>
        </div>
      </div>
    </div>
  );
}