import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

const logoSrc = "/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <div className="navbar-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={logoSrc}
            alt="AutoRenta"
            style={{ height: "40px", width: "auto", objectFit: "contain" }}
            onError={(e) => { e.target.style.display = 'none'; }}
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

          <li className={`dropdown ${openDropdown === "operaciones" ? "active" : ""}`}>
            <button
              className="dropdown-btn"
              onClick={() => toggleDropdown("operaciones")}
            >
              Operaciones
            </button>

            <div className={`dropdown-content ${openDropdown === "operaciones" ? "menu-open" : ""}`}>
              <NavLink to="/alquileres" onClick={closeMenu}>Alquileres</NavLink>
              <NavLink to="/reservas" onClick={closeMenu}>Reservas</NavLink>
            </div>
          </li>

          <li className={`dropdown ${openDropdown === "flota" ? "active" : ""}`}>
            <button
              className="dropdown-btn"
              onClick={() => toggleDropdown("flota")}
            >
              Flota
            </button>

            <div className={`dropdown-content ${openDropdown === "flota" ? "menu-open" : ""}`}>
              <NavLink to="/vehiculos" onClick={closeMenu}>Vehículos</NavLink>
              <NavLink to="/mantenimiento" onClick={closeMenu}>Mantenimiento</NavLink>
              <NavLink to="/danios" onClick={closeMenu}>Daños</NavLink>
              <NavLink to="/multas" onClick={closeMenu}>Multas</NavLink>
            </div>
          </li>

          <li className={`dropdown ${openDropdown === "admin" ? "active" : ""}`}>
            <button
              className="dropdown-btn"
              onClick={() => toggleDropdown("admin")}
            >
              Administración
            </button>

            <div className={`dropdown-content ${openDropdown === "admin" ? "menu-open" : ""}`}>
              <NavLink to="/clientes" onClick={closeMenu}>Clientes</NavLink>
              <NavLink to="/empleados" onClick={closeMenu}>Empleados</NavLink>
            </div>
          </li>

          <li>
            <NavLink to="/reportes" onClick={closeMenu}>Reportes</NavLink>
          </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;