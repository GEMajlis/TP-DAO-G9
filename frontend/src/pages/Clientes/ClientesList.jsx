import "../../styles/PageLayout.css";

export default function Clientes() {
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Clientes</h2>
      <p className="page-subtitle">
        Administrá la información y el historial de tus clientes.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Ver lista de clientes</h3>
          <p>Consultá todos los clientes registrados y sus datos de contacto.</p>
          <button className="btn-primary">Ver clientes</button>
        </div>

        <div className="page-card">
          <h3>Agregar nuevo cliente</h3>
          <p>Registrá un nuevo cliente completando los datos requeridos.</p>
          <button className="btn-primary">Nuevo cliente</button>
        </div>
      </div>
    </div>
  );
}