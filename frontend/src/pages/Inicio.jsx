import { useNavigate } from "react-router-dom";
import "../styles/PageLayout.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Concesionaria</h2>
      <p className="page-subtitle">
        Administrá clientes, vehículos, alquileres y más de forma simple y rápida.
      </p>

      <div className="page-content">

        {/* CLIENTES */}
        <div className="page-card">
          <h3>1. Registrá Clientes</h3>
          <p>Agregá y gestioná tus clientes fácilmente.</p>
          <button className="btn-primary" onClick={() => navigate("/clientes")}>
            Ver Clientes
          </button>
        </div>

        {/* VEHÍCULOS */}
        <div className="page-card">
          <h3>2. Controlá Vehículos</h3>
          <p>Mantené actualizada la flota disponible.</p>
          <button className="btn-primary" onClick={() => navigate("/vehiculos")}>
            Ver Vehículos
          </button>
        </div>

        {/* RESERVAS */}
        <div className="page-card">
          <h3>3. Gestioná Reservas</h3>
          <p>Organizá alquileres y mantenimientos en segundos.</p>
          <button className="btn-primary" onClick={() => navigate("/reservas")}>
            Ver Reservas
          </button>
        </div>

        {/* ALQUILERES */}
        <div className="page-card">
          <h3>4. Gestioná Alquileres</h3>
          <p>Controlá alquileres activos y finalizados.</p>
          <button className="btn-primary" onClick={() => navigate("/alquileres")}>
            Ver Alquileres
          </button>
        </div>

        {/* MULTAS */}
        <div className="page-card">
          <h3>5. Multas</h3>
          <p>Consultá y administrá las multas de cada alquiler.</p>
          <button className="btn-primary" onClick={() => navigate("/multas")}>
            Ver Multas
          </button>
        </div>

        {/* MANTENIMIENTO */}
        <div className="page-card">
          <h3>6. Mantenimientos</h3>
          <p>Iniciá y finalizá mantenimientos de vehículos.</p>
          <button className="btn-primary" onClick={() => navigate("/mantenimiento")}>
            Ver Mantenimientos
          </button>
        </div>

        {/* DAÑOS */}
        <div className="page-card">
          <h3>7. Daños</h3>
          <p>Registrá daños asociados a un alquiler.</p>
          <button className="btn-primary" onClick={() => navigate("/danios")}>
            Ver Daños
          </button>
        </div>

        {/* EMPLEADOS */}
        <div className="page-card">
          <h3>8. Empleados</h3>
          <p>Gestioná tus empleados registrados.</p>
          <button className="btn-primary" onClick={() => navigate("/empleados")}>
            Ver Empleados
          </button>
        </div>

        {/* REPORTES */}
        <div className="page-card">
          <h3>9. Reportes</h3>
          <p>Estadísticas e informes del sistema.</p>
          <button className="btn-primary" onClick={() => navigate("/reportes")}>
            Ver Reportes
          </button>
        </div>

      </div>
    </div>
  );
}
