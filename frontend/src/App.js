import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import Torneos from './pages/Torneos';
import DetallesTorneo from './pages/DetallesTorneo';
import DetallesJugador from './pages/DetallesJugador';
import MisMazos from './pages/MisMazos';
import Sidebar from './components/layout/Sidebar'; // Importamos el nuevo menú

// Componente Layout que envuelve las rutas privadas
const LayoutPrivado = ({ children }) => {
    const token = localStorage.getItem('token');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!token) {
        return <Navigate to="/" />;
    }

    return (
        <div className="dashboard-layout">
            {/* Botón hamburguesa para móvil */}
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰ Menú
            </button>

            {/* Menú Lateral */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />

            {/* Contenido de la página */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas (Login/Registro no llevan menú) */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        
        {/* Rutas Privadas con el nuevo Dashboard */}
        <Route 
            path="/torneos" 
            element={<LayoutPrivado><Torneos /></LayoutPrivado>} 
        />
        <Route 
            path="/torneos/:id" 
            element={<LayoutPrivado><DetallesTorneo /></LayoutPrivado>} 
        />
        <Route 
            path="/jugador/:id" 
            element={<LayoutPrivado><DetallesJugador /></LayoutPrivado>} 
        />
        <Route 
            path="/mis-mazos" 
            element={<LayoutPrivado><MisMazos /></LayoutPrivado>} 
        />
      </Routes>
    </Router>
  );
}

export default App;