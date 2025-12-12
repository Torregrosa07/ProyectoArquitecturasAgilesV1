import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Función helper para clase activa
    const getClass = (path) => {
        return location.pathname === path ? 'nav-link active' : 'nav-link';
    };

    const cerrarSesion = () => {
        if(window.confirm("¿Cerrar sesión?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            navigate('/');
        }
    };

    return (
        <>
            {/* Fondo oscuro para móvil cuando el menú está abierto */}
            {isOpen && (
                <div 
                    onClick={toggleSidebar}
                    style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900}} 
                />
            )}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <h2> Clash Manager</h2>
                
                <nav>
                    <Link to="/torneos" className={getClass('/torneos')} onClick={toggleSidebar}>
                         <span>Torneos</span>
                    </Link>
                    
                    <Link to="/mis-mazos" className={getClass('/mis-mazos')} onClick={toggleSidebar}>
                         <span>Mis Mazos</span>
                    </Link>
                </nav>

                <button onClick={cerrarSesion} className="logout-btn">
                     Cerrar Sesión
                </button>
            </aside>
        </>
    );
};

// ¡ESTA LÍNEA ES LA MÁS IMPORTANTE PARA EVITAR EL ERROR!
export default Sidebar;