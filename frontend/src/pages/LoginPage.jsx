import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../config/axios'; // Importamos nuestra configuración

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Usamos clienteAxios en lugar de axios directo
      const res = await clienteAxios.post('/api/auth/login', formData);
      
      // GUARDAR TOKEN
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      
      // Redireccionar
      navigate('/torneos');
      
    } catch (err) {
      console.log(err);
      // Manejo de errores seguro
      setError(err.response?.data?.msg || 'Error al conectar');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#2c3e50' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>Clash Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={{ padding: '8px' }} />
          <input type="password" name="password" placeholder="Contraseña" required onChange={handleChange} style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '10px', background: '#f39c12', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>ENTRAR</button>
        </form>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;