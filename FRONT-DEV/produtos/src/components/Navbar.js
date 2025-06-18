// FRONT-DEV/produtos/src/components/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Usar NavLink para estilo de link ativo
import '../App.css'; // Para usar os estilos definidos no App.css

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/produtos" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Produtos
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/grupos" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Grupos
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/unidades" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Unidades
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/cidades" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            Cidades
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;