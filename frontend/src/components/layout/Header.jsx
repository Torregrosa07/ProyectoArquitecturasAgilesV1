import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/');
    }

    return ( 
        <header style={{ background: '#282c34', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>Gestor de <span>Torneos</span></h2>
            <nav>
                {!token ? (
                    <>
                        <Link to="/" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
                        <Link to="/registro" style={{ color: 'white', textDecoration: 'none' }}>Registro</Link>
                    </>
                ) : (
                    <>
                        <Link to="/torneos" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Mis Torneos</Link>
                        <button 
                            onClick={cerrarSesion}
                            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '5px' }}
                        >Cerrar Sesión</button>
                    </>
                )}
            </nav>
        </header>
     );
}
 
export default Header;