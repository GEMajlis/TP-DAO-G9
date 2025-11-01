import "../../styles/PageLayout.css";

export default function Vehiculos() {
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Vehículos</h2>
      <p className="page-subtitle">
        Controlá el estado, modelo y disponibilidad de cada vehículo.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Listado de vehículos</h3>
          <p>Visualizá toda la flota y su disponibilidad actual.</p>
          <button className="btn-primary">Ver flota</button>
        </div>

        <div className="page-card">
          <h3>Agregar vehículo</h3>
          <p>Registrá un nuevo vehículo en el sistema.</p>
          <button className="btn-primary">Agregar</button>
        </div>
      </div>
    </div>
  );
}