import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegistroPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', tagClash: '', edad: '', nacionalidad: 'España', modalidad_preferida: 'Ladder'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/registro', { ...formData, mazos: [] });
      alert('¡Cuenta creada! Inicia sesión.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al registrarse');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#34495e' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '320px' }}>
        <h2 style={{textAlign: 'center'}}>Nuevo Jugador</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input name="nombre" placeholder="Usuario" onChange={handleChange} required style={{padding: '8px'}} />
          <input name="email" type="email" placeholder="Correo" onChange={handleChange} required style={{padding: '8px'}} />
          <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required style={{padding: '8px'}} />
          <input name="tagClash" placeholder="Tag (#...)" onChange={handleChange} required style={{padding: '8px'}} />
          <button type="submit" style={{ padding: '10px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>Registrarme</button>
        </form>
        <p style={{textAlign: 'center', marginTop: '10px'}}><Link to="/login">Volver al Login</Link></p>
      </div>
    </div>
  );
};
export default RegistroPage;