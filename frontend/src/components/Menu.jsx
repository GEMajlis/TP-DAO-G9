import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
function Menu() {

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src="/coding.png" alt="Icono" style={{ maxWidth: "50px", marginRight: "5px", marginLeft: '10px' }} />
                    <span className="logo">Alquiler de vehículos</span>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/inicio">
                                Inicio
                            </NavLink>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export { Menu };
