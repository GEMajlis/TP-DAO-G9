import "../../styles/PageLayout.css";

export default function Danios() {
  return (
    <div className="page-container">
      <h2 className="page-title">Registro de Daños</h2>
      <p className="page-subtitle">
        Mantené un control detallado de los daños ocurridos durante los alquileres.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Ver daños reportados</h3>
          <p>Consultá todos los daños asociados a cada alquiler.</p>
          <button className="btn-primary">Ver registros</button>
        </div>

        <div className="page-card">
          <h3>Registrar nuevo daño</h3>
          <p>Ingresá una descripción y el monto de reparación estimado.</p>
          <button className="btn-primary">Registrar</button>
        </div>

        <div className="page-card">
          <h3>Costos y reparaciones</h3>
          <p>Accedé al historial de reparaciones y gastos asociados.</p>
          <button className="btn-primary">Ver historial</button>
        </div>
      </div>
    </div>
  );
}