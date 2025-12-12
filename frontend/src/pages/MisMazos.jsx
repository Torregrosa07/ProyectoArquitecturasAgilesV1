import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';

const MisMazos = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [cartasDisponibles, setCartasDisponibles] = useState([]);
    const [modoCrear, setModoCrear] = useState(false);
    const [nuevoMazoNombre, setNuevoMazoNombre] = useState('');
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
    const [errorCritico, setErrorCritico] = useState(false);

    const forzarCierre = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const obtenerUsuario = async () => {
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');
        if (!usuarioLocal || !usuarioLocal.id) {
            setErrorCritico(true);
            return;
        }
        try {
            const res = await clienteAxios.get(`/api/usuarios/${usuarioLocal.id}`, { headers: { 'x-auth-token': token } });
            setUsuario(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const obtenerCartasOficiales = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await clienteAxios.get('/api/clash/cartas', { headers: { 'x-auth-token': token } });
            if(res.data && res.data.length > 0) setCartasDisponibles(res.data);
        } catch (error) {
            console.log("Error API");
        }
    };

    useEffect(() => {
        obtenerUsuario();
        obtenerCartasOficiales();
    }, []);

    const toggleCarta = (carta) => {
        if (cartasSeleccionadas.find(c => c.id === carta.id)) {
            setCartasSeleccionadas(cartasSeleccionadas.filter(c => c.id !== carta.id));
        } else {
            if (cartasSeleccionadas.length < 8) setCartasSeleccionadas([...cartasSeleccionadas, carta]);
            else alert("El mazo ya tiene 8 cartas");
        }
    };

    const guardarMazo = async () => {
        if (!nuevoMazoNombre.trim() || cartasSeleccionadas.length !== 8) return alert("Debes poner un nombre y seleccionar 8 cartas");
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.put('/api/usuarios/agregar-mazo', {
                nombreMazo: nuevoMazoNombre,
                cartas: cartasSeleccionadas
            }, { headers: { 'x-auth-token': token } });
            
            alert("Mazo guardado correctamente");
            setModoCrear(false);
            setCartasSeleccionadas([]);
            setNuevoMazoNombre('');
            obtenerUsuario();
        } catch (error) {
            alert("Error al guardar el mazo");
        }
    };

    const eliminarMazo = async (id) => {
        if(!window.confirm("¿Estás seguro de borrar este mazo?")) return;
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.delete(`/api/usuarios/eliminar-mazo/${id}`, { headers: { 'x-auth-token': token } });
            obtenerUsuario();
        } catch (error) { console.error(error); }
    };

    const promedioElixir = () => {
        if (cartasSeleccionadas.length === 0) return 0;
        const total = cartasSeleccionadas.reduce((acc, curr) => acc + curr.elixir, 0);
        return (total / cartasSeleccionadas.length).toFixed(1);
    };

    if (errorCritico) {
        return (
            <div style={{padding: '50px', textAlign: 'center', backgroundColor: '#e74c3c', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <h1>Error de Sesión</h1>
                <p>Es necesario actualizar tus credenciales.</p>
                <button onClick={forzarCierre} className="btn-primary" style={{padding: '15px 30px', marginTop: '20px', backgroundColor: 'white', color: '#e74c3c', border: 'none'}}>Reparar Ahora</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{color: 'var(--clash-blue-dark)'}}>Mis Mazos ({usuario?.mazos?.length || 0})</h1>
                {!modoCrear && (
                    <button onClick={() => setModoCrear(true)} className="btn-primary">Nuevo Mazo</button>
                )}
            </div>

            {modoCrear ? (
                <div className="clash-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                        <h2 style={{margin: 0}}>Constructor de Mazo</h2>
                        <button onClick={()=>setModoCrear(false)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Cerrar</button>
                    </div>
                    <div style={{display:'flex', gap: '10px', marginBottom: '15px'}}>
                        <input type="text" placeholder="Nombre del Mazo" value={nuevoMazoNombre} onChange={e=>setNuevoMazoNombre(e.target.value)} style={{flex: 1}}/>
                        <button onClick={guardarMazo} className="btn-primary" style={{backgroundColor: '#2ecc71'}}>Guardar</button>
                    </div>
                    <p style={{fontWeight: 'bold', color: '#8e44ad'}}>Coste Medio: {promedioElixir()}</p>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px', height: '120px', background: '#f0f2f5', padding: '10px', borderRadius: '10px', overflowX: 'auto'}}>
                        {cartasSeleccionadas.map(c => (
                            <img key={c.id} src={c.imagen} alt={c.nombre} style={{height: '100%', cursor: 'pointer', borderRadius: '5px'}} onClick={()=>toggleCarta(c)} />
                        ))}
                        {[...Array(8 - cartasSeleccionadas.length)].map((_, i) => (
                             <div key={i} style={{height: '100%', width: '90px', border: '2px dashed #ccc', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc'}}>Carta</div>
                        ))}
                    </div>
                    <h3 style={{marginTop: 0}}>Colección</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', maxHeight: '400px', overflowY: 'auto', padding: '5px'}}>
                        {cartasDisponibles.map(c => {
                            const isSelected = cartasSeleccionadas.find(sel => sel.id === c.id);
                            return (
                                <div key={c.id} style={{position: 'relative'}}>
                                    <img 
                                        src={c.imagen} 
                                        alt={c.nombre} 
                                        style={{width: '100%', opacity: isSelected ? 0.4 : 1, cursor: 'pointer', borderRadius: '4px', transform: isSelected ? 'scale(0.9)' : 'scale(1)', transition: 'transform 0.1s'}}
                                        onClick={()=>toggleCarta(c)} 
                                    />
                                    {isSelected && <div style={{position: 'absolute', top: 0, right: 0, background: '#2ecc71', color: 'white', borderRadius: '50%', width: '20px', height: '20px', textAlign: 'center', lineHeight: '20px'}}></div>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="card-container">
                    {usuario?.mazos?.length === 0 && <p style={{color: '#777'}}>No tienes mazos. ¡Crea uno!</p>}
                    {usuario?.mazos?.map((mazo) => (
                        <div key={mazo._id} className="clash-card">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                <h3 style={{margin:0}}>{mazo.nombreMazo}</h3>
                                <button onClick={() => eliminarMazo(mazo._id)} style={{background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px'}}>Eliminar</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
                                {mazo.cartas.map((c, i) => (
                                    <div key={i} title={c.nombre}>
                                        <img src={c.imagen || 'https://via.placeholder.com/50'} alt={c.nombre} style={{ width: '100%', borderRadius: '4px' }} />
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

export default MisMazos;