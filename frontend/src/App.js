import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Componentes
import { Footer } from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx"; 

// Páginas
import Home from "./pages/Inicio";
import Clientes from "./pages/Clientes/ClientesPage.jsx";
import Vehiculos from "./pages/Vehiculos/VehiculosPage.jsx";
import Alquileres from "./pages/Alquileres/AlquileresPage.jsx";
import Reservas from "./pages/Reservas/ReservasPage.jsx";
import Danios from "./pages/Danios/DaniosPage.jsx";
import Empleados from "./pages/Empleados/EmpleadosPage.jsx";
import Mantenimiento from "./pages/Mantenimientos/MantenimientosPage.jsx";
import Multas from "./pages/Multas/MultasPage.jsx";
import Reportes from "./pages/Reportes/ReportesPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

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
          <Route path="/reportes" element={<Reportes />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}