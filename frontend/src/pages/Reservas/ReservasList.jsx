import "../../styles/PageLayout.css";

export default function Reservas() {
  return (
    <div className="page-container">
      <h2 className="page-title">Reservas</h2>
      <p className="page-subtitle">
        Controlá las reservas activas, pasadas y futuras.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Ver reservas</h3>
          <p>Revisá todas las reservas realizadas por tus clientes.</p>
          <button className="btn-primary">Ver reservas</button>
        </div>

        <div className="page-card">
          <h3>Crear reserva</h3>
          <p>Generá una nueva reserva asociada a un cliente y vehículo.</p>
          <button className="btn-primary">Nueva reserva</button>
        </div>
      </div>
    </div>
  );
}