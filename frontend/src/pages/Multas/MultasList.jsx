import "../../styles/PageLayout.css";

export default function Multas() {
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Multas</h2>
      <p className="page-subtitle">
        Controlá las multas asociadas a los alquileres y su estado de pago.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Ver multas registradas</h3>
          <p>Consultá todas las infracciones vinculadas a vehículos alquilados.</p>
          <button className="btn-primary">Ver multas</button>
        </div>

        <div className="page-card">
          <h3>Registrar nueva multa</h3>
          <p>Ingresá una nueva multa con su monto y fecha correspondiente.</p>
          <button className="btn-primary">Registrar</button>
        </div>

        <div className="page-card">
          <h3>Pagos y estado</h3>
          <p>Verificá cuáles multas ya fueron abonadas o están pendientes.</p>
          <button className="btn-primary">Ver pagos</button>
        </div>
      </div>
    </div>
  );
}