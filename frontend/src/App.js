import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import Torneos from './pages/Torneos';

// Componente de orden superior para proteger rutas
const RutaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        
        {/* Ruta Protegida: Dashboard de Torneos */}
        <Route 
            path="/torneos" 
            element={
                <RutaPrivada>
                    <Torneos />
                </RutaPrivada>
            } 
        />
      </Routes>
    </Router>
  );
}

export default App;