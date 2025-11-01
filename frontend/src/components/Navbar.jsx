import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <strong>Gestión de Concesionaria</strong>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/" end>Inicio</NavLink></li>
        <li><NavLink to="/clientes">Clientes</NavLink></li>
        <li><NavLink to="/vehiculos">Vehículos</NavLink></li>
        <li><NavLink to="/reservas">Reservas</NavLink></li>
        <li><NavLink to="/alquileres">Alquileres</NavLink></li>
        <li><NavLink to="/danios">Daños</NavLink></li>
        <li><NavLink to="/empleados">Empleados</NavLink></li>
        <li><NavLink to="/mantenimiento">Mantenimiento</NavLink></li>
        <li><NavLink to="/multas">Multas</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;