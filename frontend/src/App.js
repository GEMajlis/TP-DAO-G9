
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// 🔹 Páginas
import Home from "./pages/Inicio";
import Clientes from "./pages/Clientes/ClientesList";
import Vehiculos from "./pages/Vehiculos/VehiculosList";
import Reservas from "./pages/Reservas/ReservasList";
import Alquileres from "./pages/Alquileres/AlquileresList";
import Danios from "./pages/Danios//DaniosList";
import Empleados from "./pages/Empleados/EmpleadosList";
import Mantenimiento from "./pages/Mantenimientos/MantenimientosList";
import Multas from "./pages/Multas/MultasList";

export default function App() {
  return (

    <Router>
      {/* 🔹 Navbar superior */}
      <header>
        <Navbar />
      </header>

      {/* 🔹 Contenido principal */}
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/alquileres" element={<Alquileres />} />
          <Route path="/danios" element={<Danios />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/mantenimiento" element={<Mantenimiento />} />
          <Route path="/multas" element={<Multas />} />
        </Routes>
      </main>
    </Router>
  );
}
