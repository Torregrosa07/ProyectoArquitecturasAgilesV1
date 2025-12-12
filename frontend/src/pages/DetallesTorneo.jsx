import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';

const DetallesTorneo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [torneo, setTorneo] = useState(null);
    const [partidas, setPartidas] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

    const obtenerDatos = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token }};
            
            const reqTorneo = await clienteAxios.get(`/api/torneos/${id}`, config);
            const reqPartidas = await clienteAxios.get(`/api/partidos/torneo/${id}`, config);
            
            setTorneo(reqTorneo.data);
            setPartidas(reqPartidas.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, [id]);

    const iniciarTorneo = async () => {
        if(!window.confirm("¿Estás seguro? Esto generará los cruces y no se puede deshacer.")) return;
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.post(`/api/partidos/generar/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            obtenerDatos();
        } catch (error) {
            alert("Error: " + (error.response?.data?.msg || "Faltan jugadores para iniciar"));
        }
    };

    const unirseTorneo = async () => {
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.put(`/api/torneos/unirse/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            obtenerDatos();
        } catch (error) {
            alert("Error al unirse: " + (error.response?.data?.mensaje || error.message));
        }
    };

    // --- NUEVA FUNCIÓN: ELIMINAR TORNEO ---
    const eliminarTorneo = async () => {
        if(!window.confirm("⚠ ¿PELIGRO: Estás seguro de eliminar este torneo y todos sus datos?")) return;
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.delete(`/api/torneos/${id}`, {
                headers: { 'x-auth-token': token }
            });
            alert("Torneo eliminado correctamente");
            navigate('/torneos'); // Redirigir al listado
        } catch (error) {
            alert("Error al eliminar: " + error.response?.data?.msg);
        }
    };

    // --- LÓGICA PARA EL BRACKET ---
    // Agrupamos los partidos por número de ronda: { 1: [partido, partido], 2: [partido] }
    const partidasPorRonda = partidas.reduce((acc, partida) => {
        const ronda = partida.ronda;
        if (!acc[ronda]) acc[ronda] = [];
        acc[ronda].push(partida);
        return acc;
    }, {});

    if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Cargando arena...</div>;

    const soyCreador = torneo.creador?._id === usuarioLogueado?.id;
    const yaEstoyInscrito = torneo.participantes.some(p => p.jugador._id === usuarioLogueado?.id);

    return (
        <div style={{ padding: '2rem' }}>
            
            {/* CABECERA */}
            <div className="clash-card" style={{textAlign: 'center', marginBottom: '30px', borderBottom: '6px solid var(--clash-blue)', position: 'relative'}}>
                
                {/* Botón Eliminar (Solo Creador) */}
                {soyCreador && (
                    <button 
                        onClick={eliminarTorneo}
                        style={{
                            position: 'absolute', top: 15, right: 15, 
                            background: '#e74c3c', color: 'white', border: 'none', 
                            padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        🗑 ELIMINAR
                    </button>
                )}

                <h1 style={{color: 'var(--clash-blue-dark)', fontSize: '2.5rem', margin: '10px 0'}}>
                    {torneo.nombre}
                </h1>
                <div style={{display: 'flex', justifyContent: 'center', gap: '15px', color: '#57606f', fontWeight: 'bold'}}>
                    <span>📅 {new Date(torneo.fecha).toLocaleDateString()}</span>
                    <span>⚔️ {torneo.modalidad}</span>
                    <span style={{color: torneo.estado === 'abierto' ? '#2ecc71' : '#e74c3c'}}>
                        ● {torneo.estado.toUpperCase()}
                    </span>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    {soyCreador && torneo.estado === 'abierto' && (
                        <button onClick={iniciarTorneo} className="btn-primary" style={{backgroundColor: 'var(--clash-gold)', color: '#5e3803'}}>
                            ⚡ INICIAR TORNEO
                        </button>
                    )}

                    {torneo.estado === 'abierto' && !yaEstoyInscrito && (
                        <button onClick={unirseTorneo} className="btn-primary" style={{backgroundColor: '#2ecc71', boxShadow: '0 6px 0 #27ae60', color: 'white'}}>
                            ⚔️ UNIRSE
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* SECCIÓN BRACKET VISUAL */}
                <div>
                    <h2 style={{color: 'var(--clash-blue-dark)', borderBottom: '3px solid #dfe4ea', paddingBottom: '10px'}}>
                        🏆 Bracket del Torneo
                    </h2>
                    
                    {partidas.length === 0 ? (
                        <div className="clash-card" style={{textAlign: 'center', color: '#7f8c8d', padding: '40px'}}>
                            <p>El torneo aún no ha comenzado.</p>
                        </div>
                    ) : (
                        <div className="bracket-container">
                            {Object.keys(partidasPorRonda).map((rondaNum) => (
                                <div key={rondaNum} className="ronda-column">
                                    <div className="ronda-title">Ronda {rondaNum}</div>
                                    {partidasPorRonda[rondaNum].map(partida => {
                                        const j1Ganador = partida.ganador === partida.jugador1?._id;
                                        const j2Ganador = partida.ganador === partida.jugador2?._id;

                                        return (
                                            <div key={partida._id} className="clash-card" style={{padding: '10px', width: '250px', border: '1px solid #ccc'}}>
                                                {/* JUGADOR 1 */}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between', padding: '5px', borderRadius: '5px',
                                                    background: j1Ganador ? '#dff9fb' : 'transparent',
                                                    fontWeight: j1Ganador ? 'bold' : 'normal'
                                                }}>
                                                    <span>{partida.jugador1 ? partida.jugador1.nombre : '???'}</span>
                                                    <span>{partida.marcador.coronasJ1}</span>
                                                </div>
                                                
                                                <div style={{height: '1px', background: '#eee', margin: '5px 0'}}></div>

                                                {/* JUGADOR 2 */}
                                                <div style={{
                                                    display: 'flex', justifyContent: 'space-between', padding: '5px', borderRadius: '5px',
                                                    background: j2Ganador ? '#dff9fb' : 'transparent',
                                                    fontWeight: j2Ganador ? 'bold' : 'normal'
                                                }}>
                                                    <span>{partida.jugador2 ? partida.jugador2.nombre : '???'}</span>
                                                    <span>{partida.marcador.coronasJ2}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* LISTA DE JUGADORES (ABAJO) */}
                <div>
                    <h2 style={{color: 'var(--clash-blue-dark)', borderBottom: '3px solid #dfe4ea', paddingBottom: '10px'}}>
                        👥 Lista de Inscritos
                    </h2>
                    <div className="card-container">
                        {torneo.participantes.map(p => (
                            <Link to={`/jugador/${p.jugador._id}`} key={p._id} style={{textDecoration: 'none'}}>
                                <div className="clash-card" style={{padding: '10px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                    <div style={{width: '40px', height: '40px', background: 'var(--clash-blue)', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'}}>
                                        {p.jugador.nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{color: '#333', fontWeight: 'bold'}}>{p.jugador.nombre}</div>
                                        <div style={{color: '#999', fontSize: '0.8rem'}}>{p.jugador.tagClash}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DetallesTorneo;