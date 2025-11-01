import "../../styles/PageLayout.css";

export default function Empleados() {
  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Empleados</h2>
      <p className="page-subtitle">
        Administrá la información, roles y tareas del personal de la concesionaria.
      </p>

      <div className="page-content">
        <div className="page-card">
          <h3>Listado de empleados</h3>
          <p>Consultá la nómina de empleados registrados.</p>
          <button className="btn-primary">Ver lista</button>
        </div>

        <div className="page-card">
          <h3>Agregar empleado</h3>
          <p>Registrá nuevos empleados y asignales un rol.</p>
          <button className="btn-primary">Agregar</button>
        </div>

        <div className="page-card">
          <h3>Editar información</h3>
          <p>Actualizá los datos o el puesto de un empleado existente.</p>
          <button className="btn-primary">Editar</button>
        </div>
      </div>
    </div>
  );
}