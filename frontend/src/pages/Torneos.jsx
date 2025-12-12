import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

const Torneos = () => {
    const [torneos, setTorneos] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    const [nuevoTorneo, setNuevoTorneo] = useState({
        nombre: '',
        modalidad: 'Elección',
        cantidad_jugadores: 50,
        fecha: ''
    });

    const obtenerTorneos = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const respuesta = await clienteAxios.get('/api/torneos', {
                headers: { 'x-auth-token': token }
            });
            
            setTorneos(respuesta.data.torneos || respuesta.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        obtenerTorneos();
    }, []);

    const handleChange = (e) => {
        setNuevoTorneo({
            ...nuevoTorneo,
            [e.target.name]: e.target.value
        });
    };

    const crearTorneo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.post('/api/torneos', nuevoTorneo, {
                headers: { 'x-auth-token': token }
            });
            setMostrarModal(false);
            obtenerTorneos();
        } catch (error) {
            alert("Error al crear torneo: " + (error.response?.data?.msg || error.message));
        }
    };

    // Función auxiliar para el color del estado
    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'abierto': return '#2ecc71'; // Verde
            case 'en curso': return '#e67e22'; // Naranja
            case 'finalizado': return '#e74c3c'; // Rojo
            default: return '#95a5a6';
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* CABECERA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{color: 'var(--clash-blue-dark)', margin: 0, textShadow: 'none'}}>
                     Arenas Reales
                </h1>
                <button 
                    onClick={() => setMostrarModal(true)}
                    className="btn-primary"
                    style={{backgroundColor: 'var(--clash-gold)', color: '#5e3803'}}
                >
                    + CREAR TORNEO
                </button>
            </div>

            {/* LISTA DE TORNEOS */}
            {torneos.length === 0 ? (
                <div style={{textAlign: 'center', color: '#7f8c8d', marginTop: '50px'}}>
                    <h2>No hay torneos activos</h2>
                    <p>¡Sé el primero en crear una arena de batalla!</p>
                </div>
            ) : (
                <div className="card-container">
                    {torneos.map(torneo => (
                        <div key={torneo._id} className="clash-card" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <div>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                                    <h3 style={{fontSize: '1.4rem', marginBottom: '10px'}}>{torneo.nombre}</h3>
                                    <span style={{
                                        fontSize: '0.8rem', 
                                        padding: '4px 8px', 
                                        borderRadius: '10px', 
                                        color: 'white', 
                                        backgroundColor: getEstadoColor(torneo.estado),
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {torneo.estado}
                                    </span>
                                </div>
                                
                                <div style={{color: '#57606f', marginBottom: '20px', fontSize: '0.95rem'}}>
                                    <p style={{margin: '5px 0'}}> <strong>Modo:</strong> {torneo.modalidad}</p>
                                    <p style={{margin: '5px 0'}}> <strong>Fecha:</strong> {new Date(torneo.fecha).toLocaleDateString()}</p>
                                    <p style={{margin: '5px 0'}}> <strong>Jugadores:</strong> {torneo.participantes.length} / {torneo.cantidad_jugadores}</p>
                                    <p style={{margin: '5px 0', fontSize: '0.8em', color: '#a4b0be'}}>
                                         Creado por: {torneo.creador?.nombre || 'Desconocido'}
                                    </p>
                                </div>
                            </div>

                            <Link to={`/torneos/${torneo._id}`} style={{textDecoration: 'none'}}>
                                <button className="btn-primary" style={{width: '100%', backgroundColor: 'var(--clash-blue)', color: 'white', boxShadow: '0 6px 0 var(--clash-blue-dark)'}}>
                                    ENTRAR A LA ARENA
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE CREACIÓN ESTILO CLASH */}
            {mostrarModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="clash-card" style={{ width: '400px', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <div style={{borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>
                            <h2 style={{margin: 0, color: 'var(--clash-blue-dark)', textAlign: 'center'}}>Nuevo Torneo</h2>
                        </div>
                        
                        <form onSubmit={crearTorneo}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#57606f'}}>Nombre</label>
                                <input 
                                    type="text" 
                                    name="nombre" 
                                    placeholder="Ej: Copa del Rey"
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#57606f'}}>Fecha de Inicio</label>
                                <input 
                                    type="date" 
                                    name="fecha" 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#57606f'}}>Modalidad</label>
                                <select 
                                    name="modalidad" 
                                    onChange={handleChange} 
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                >
                                    <option value="Elección">Elección</option>
                                    <option value="Mazo Clásico">Mazo Clásico</option>
                                    <option value="Muerte Súbita">Muerte Súbita</option>
                                    <option value="Triple Elixir">Triple Elixir</option>
                                </select>
                            </div>
                            
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#57606f'}}>Max. Jugadores</label>
                                <input 
                                    type="number" 
                                    name="cantidad_jugadores" 
                                    defaultValue={50}
                                    onChange={handleChange} 
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarModal(false)}
                                    className="btn-primary"
                                    style={{ flex: 1, backgroundColor: '#e74c3c', color: 'white', boxShadow: '0 6px 0 #c0392b' }}
                                >
                                    CANCELAR
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn-primary"
                                    style={{ flex: 1, backgroundColor: '#2ecc71', color: 'white', boxShadow: '0 6px 0 #27ae60' }}
                                >
                                    CREAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Animación para el modal */}
            <style>{`
                @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Torneos;