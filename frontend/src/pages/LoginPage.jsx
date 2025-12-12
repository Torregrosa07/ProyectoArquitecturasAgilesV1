import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await clienteAxios.post('/api/auth/login', { email, password });
            
            // --- DEBUG EN EL NAVEGADOR ---
            console.log("📥 RESPUESTA LOGIN:", res.data);
            
            if(!res.data.usuario.id) {
                alert("⚠ PELIGRO: El servidor no devolvió el ID. Revisa la terminal del backend.");
                return;
            }

            // GUARDAR EN LOCALSTORAGE
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
            
            // REDIRIGIR
            navigate('/mis-mazos');
            
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.msg || "Error al iniciar sesión");
        }
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#2c3e50'}}>
            <div className="clash-card" style={{width: '400px', padding: '40px'}}>
                <h1 style={{textAlign: 'center', color: '#333'}}>Clash Login</h1>
                <form onSubmit={onSubmit}>
                    <div style={{marginBottom: '15px'}}>
                        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" style={{width: '100%'}} required />
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <input type="password" name="password" value={password} onChange={onChange} placeholder="Contraseña" style={{width: '100%'}} required />
                    </div>
                    <button type="submit" className="btn-primary" style={{width: '100%', background: '#e67e22'}}>ENTRAR</button>
                </form>
                <p style={{textAlign: 'center', marginTop: '15px'}}>
                    ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;