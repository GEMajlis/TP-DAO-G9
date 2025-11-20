import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Componentes
import { Footer } from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx"; 

// Páginas
import Home from "./pages/Inicio";
import Clientes from "./pages/Clientes/ClientesList";
import Vehiculos from "./pages/Vehiculos/VehiculosPage.jsx";
import Reservas from "./pages/Reservas/ReservasList";
import Alquileres from "./pages/Alquileres/AlquileresPage.jsx";
import Danios from "./pages/Danios/DaniosList";
import Empleados from "./pages/Empleados/EmpleadosList";
import Mantenimiento from "./pages/Mantenimientos/MantenimientosList";
import Multas from "./pages/Multas/MultasList";

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
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}