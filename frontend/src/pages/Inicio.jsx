import "../styles/PageLayout.css";

export default function Home() {
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Concesionaria</h2>
      <p className="page-subtitle">
        Administrá clientes, vehículos, alquileres y más de forma simple y rápida.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>1. Registrá Clientes</h3>
          <p>Agregá y gestioná tus clientes fácilmente.</p>
          <button className="btn-primary">Ver Clientes</button>
        </div>

        <div className="page-card">
          <h3>2. Controlá Vehículos</h3>
          <p>Mantené actualizada la flota disponible.</p>
          <button className="btn-primary">Ver Vehículos</button>
        </div>

        <div className="page-card">
          <h3>3. Gestioná Reservas</h3>
          <p>Organizá alquileres y mantenimientos en segundos.</p>
          <button className="btn-primary">Ver Reservas</button>
        </div>
      </div>
    </div>
  );
}