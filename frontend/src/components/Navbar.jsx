import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";
const logoSrc = "/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <div className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={logoSrc}
            alt="AutoRenta"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>AutoRenta</span>
        </div>

        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-links ${menuOpen ? "show" : ""}`}>
          <li><NavLink to="/" end onClick={closeMenu}>Inicio</NavLink></li>
          <li><NavLink to="/clientes" onClick={closeMenu}>Clientes</NavLink></li>
          <li><NavLink to="/vehiculos" onClick={closeMenu}>Vehículos</NavLink></li>
          <li><NavLink to="/reservas" onClick={closeMenu}>Reservas</NavLink></li>
          <li><NavLink to="/alquileres" onClick={closeMenu}>Alquileres</NavLink></li>
          <li><NavLink to="/danios" onClick={closeMenu}>Daños</NavLink></li>
          <li><NavLink to="/empleados" onClick={closeMenu}>Empleados</NavLink></li>
          <li><NavLink to="/mantenimiento" onClick={closeMenu}>Mantenimiento</NavLink></li>
          <li><NavLink to="/multas" onClick={closeMenu}>Multas</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;