import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Menu } from "./components/Menu.jsx"; // <-- Corrección de extensión
import { Footer } from "./components/Footer.jsx"; // <-- Corrección de extensión
import { Inicio } from "./components/Inicio.jsx"; // <-- Corrección de extensión

function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <div className="divBody">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}
export default App;
