import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../config/axios';

const DetallesJugador = () => {
    const { id } = useParams();
    const [jugador, setJugador] = useState(null);

    useEffect(() => {
        const obtenerJugador = async () => {
            const token = localStorage.getItem('token');
            const res = await clienteAxios.get(`/api/usuarios/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setJugador(res.data);
        };
        obtenerJugador();
    }, [id]);

    if (!jugador) return <div style={{padding:'40px', textAlign:'center'}}>Cargando perfil...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            
            {/* TARJETA DE PERFIL */}
            <div className="clash-card" style={{
                marginBottom: '30px', 
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f2f6 100%)',
                borderLeft: '8px solid var(--clash-blue)'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                    <div style={{
                        width: '80px', height: '80px', 
                        background: 'var(--clash-blue)', 
                        color: 'white', 
                        fontSize: '3rem', 
                        display: 'flex', justifyContent: 'center', alignItems: 'center', 
                        borderRadius: '20px',
                        boxShadow: '0 5px 15px rgba(74, 105, 189, 0.4)'
                    }}>
                        {jugador.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{margin: 0, color: 'var(--clash-blue-dark)', fontSize: '2.5rem'}}>{jugador.nombre}</h1>
                        <p style={{margin: '5px 0', color: '#747d8c', fontWeight: 'bold'}}>{jugador.tagClash}</p>
                    </div>
                </div>
                
                <div style={{marginTop: '20px', display: 'flex', gap: '40px', borderTop: '1px solid #dfe4ea', paddingTop: '20px'}}>
                    <div>
                        <span style={{display: 'block', fontSize: '0.8rem', color: '#a4b0be', textTransform: 'uppercase'}}>Nacionalidad</span>
                        <strong style={{fontSize: '1.2rem'}}>{jugador.nacionalidad || 'Desconocida'}</strong>
                    </div>
                    <div>
                        <span style={{display: 'block', fontSize: '0.8rem', color: '#a4b0be', textTransform: 'uppercase'}}>Modo Favorito</span>
                        <strong style={{fontSize: '1.2rem'}}>{jugador.modalidad_preferida || 'Elección'}</strong>
                    </div>
                    <div>
                        <span style={{display: 'block', fontSize: '0.8rem', color: '#a4b0be', textTransform: 'uppercase'}}>Edad</span>
                        <strong style={{fontSize: '1.2rem'}}>{jugador.edad || '?'} Años</strong>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE MAZOS */}
            <h2 style={{color: 'var(--clash-blue-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center'}}>
                 Mazos de Batalla 
                <span style={{
                    background: 'var(--clash-gold)', 
                    color: '#5e3803', 
                    fontSize: '0.9rem', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    marginLeft: '10px'
                }}>
                    {jugador.mazos.length}
                </span>
            </h2>

            {jugador.mazos.length === 0 ? (
                <p style={{color: '#7f8c8d'}}>Este jugador no tiene mazos guardados.</p>
            ) : (
                <div className="card-container">
                    {jugador.mazos.map((mazo, index) => (
                        <div key={index} className="clash-card">
                            <h3 style={{margin: '0 0 15px 0', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                                {mazo.nombreMazo}
                            </h3>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {mazo.cartas.map((carta, i) => (
                                    <div key={i} style={{textAlign: 'center'}}>
                                        <div style={{position: 'relative'}}>
                                            <img 
                                                src={carta.imagen || 'https://via.placeholder.com/60'} 
                                                alt={carta.nombre} 
                                                style={{ width: '100%', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} 
                                            />
                                            <div style={{
                                                position: 'absolute', bottom: '-5px', right: '-5px', 
                                                background: '#d63031', color: 'white', 
                                                fontSize: '0.7rem', fontWeight: 'bold', 
                                                width: '18px', height: '18px', borderRadius: '50%', 
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                border: '2px solid white'
                                            }}>
                                                {carta.elixir}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DetallesJugador;