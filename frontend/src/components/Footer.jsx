import React from 'react';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">

                {/* Contenedor principal */}
                <div className="footer-content">

                    {/* Sección 1: Marca */}
                    <div className="footer-section">
                        <h3 className="footer-brand">
                            <i className="fa-solid fa-car"></i> AutoRenta
                        </h3>
                        <p className="footer-description">
                            Sistema integral para gestión de alquiler de vehículos. Administración eficiente de reservas, contratos y flota.
                        </p>
                    </div>

                    {/* Sección 2: Enlaces rápidos */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Acceso Rápido</h4>
                        <ul className="footer-links">
                            <li><a href="/vehiculos"><i className="fa-solid fa-car-side"></i> Vehículos</a></li>
                            <li><a href="/alquileres"><i className="fa-solid fa-file-contract"></i> Alquileres</a></li>
                            <li><a href="/clientes"><i className="fa-solid fa-users"></i> Clientes</a></li>
                            <li><a href="/reservas"><i className="fa-solid fa-calendar-check"></i> Reservas</a></li>
                        </ul>
                    </div>

                    {/* Sección 3: Contacto */}
                    <div className="footer-section">
                        <h4 className="footer-heading">Contacto</h4>
                        <ul className="footer-contact">
                            <li><i className="fa-solid fa-phone"></i> <span>+54 351 123-4567</span></li>
                            <li><i className="fa-solid fa-envelope"></i> <span>info@autorenta.com</span></li>
                            <li><i className="fa-solid fa-location-dot"></i> <span>Córdoba, Argentina</span></li>
                        </ul>
                    </div>

                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <small className="footer-copy">
                        © {new Date().getFullYear()} AutoRenta. Todos los derechos reservados.
                    </small>
                </div>

            </div>
        </footer>
    );
}

export { Footer };
