import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/axios';

// --- DATOS DE CARTAS (INTEGRADOS AQUÍ PARA EVITAR ERROR DE IMPORT) ---
const CARTAS_DISPONIBLES = [
    { id: 26000000, nombre: "Caballero", elixir: 3, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVd0w3pIqB5_DSvBIATCX62RwY0ms0.png" },
    { id: 26000001, nombre: "Arqueras", elixir: 3, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/W4Hmp8MTSdXJOYqwvhtjiDzpNbSPLCzgXW0LIOMGc8u.png" },
    { id: 26000010, nombre: "Gigante", elixir: 5, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/Axr4ox5_b7edjdazMnc3JztyNMvTr9183MFi36L6ej8.png" },
    { id: 26000014, nombre: "Mosquetera", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/Tex184ac3u4xlDlDSCVUmsxYZNYcNMqKnYbSjhlZNOs.png" },
    { id: 26000015, nombre: "Bebé Dragón", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/cjC9n4AvEZJ3urkVh-rwBkJ-aRSsydIMqSAV48hAih0.png" },
    { id: 26000018, nombre: "Montapuercos", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/Ubu0oUl8tZkusurZf8XbuqxGYpYBKqMwjT74M8DMIe0.png" },
    { id: 26000004, nombre: "PEKKA", elixir: 7, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/MlArURKhn_zWAZY-Xj1qIRKLVKquarG25BXDjUQhBsA.png" },
    { id: 28000000, nombre: "Bola de Fuego", elixir: 4, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/lZD9MILQv7O-P3XBr_xOLS5idG746RlwnyQlKxc86NM.png" },
    { id: 28000001, nombre: "Flechas", elixir: 3, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/5mI__Ex9kXWVkjGIn08H2y5kge_nSFhQ82r78M_JF5g.png" },
    { id: 28000008, nombre: "Descarga", elixir: 2, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/7dxhJ5Ehra-7_b86-sXzS1hueQKHjXgQthmQ0sJj67k.png" },
    { id: 28000011, nombre: "El Tronco", elixir: 2, tipo: "Hechizo", imagen: "https://api-assets.clashroyale.com/cards/300/_iDwuDLexHPFZ_x4_a0eP-rxCS6vwWgTs6h9sxP4-DA.png" },
    { id: 26000011, nombre: "Valquiria", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/0lIoYf3Y_plFTzo95zZL93JVxpfbGDG0Jy339y_wKKU.png" },
    { id: 26000012, nombre: "Ejército de Esqueletos", elixir: 3, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/fAOToOi5pRy7pteSWKd1rgy96JnuvFBSlo06oy7c9OY.png" },
    { id: 26000049, nombre: "Mago Eléctrico", elixir: 4, tipo: "Tropa", imagen: "https://api-assets.clashroyale.com/cards/300/RsFaGdBHaDl45GP9Z2bts29PL16UK00LGPkjn5NQ84c.png" }
];

const MisMazos = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [cartasDisponibles, setCartasDisponibles] = useState([]);
    
    // Estados del constructor
    const [modoCrear, setModoCrear] = useState(false);
    const [nuevoMazoNombre, setNuevoMazoNombre] = useState('');
    const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
    
    // Estado de error crítico
    const [errorCritico, setErrorCritico] = useState(false);

    // FUNCIÓN PARA CERRAR SESIÓN Y LIMPIAR (REPARAR)
    const forzarCierre = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const obtenerUsuario = async () => {
        // 1. LEER DEL NAVEGADOR
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario'));
        const token = localStorage.getItem('token');
        
        console.log("🔍 USUARIO EN MEMORIA:", usuarioLocal);

        // DETECTOR DE FALLO: Si no hay ID, es una sesión vieja/rota
        if (!usuarioLocal || !usuarioLocal.id) {
            console.error("❌ ERROR CRÍTICO: El usuario guardado no tiene ID.");
            setErrorCritico(true);
            return;
        }

        try {
            // 2. PEDIR DATOS AL SERVIDOR
            console.log(`📡 Pidiendo mazos al servidor para ID: ${usuarioLocal.id}`);
            const res = await clienteAxios.get(`/api/usuarios/${usuarioLocal.id}`, {
                headers: { 'x-auth-token': token }
            });
            
            console.log("✅ DATOS RECIBIDOS DEL SERVIDOR:", res.data);
            setUsuario(res.data);
        } catch (error) {
            console.error("🔴 Error de conexión:", error);
            alert("Error conectando con el servidor. Mira la consola.");
        }
    };

    const obtenerCartasOficiales = async () => {
        try {
            const token = localStorage.getItem('token');
            // Intentamos obtener cartas de la API (Backend Proxy)
            const res = await clienteAxios.get('/api/clash/cartas', {
                headers: { 'x-auth-token': token }
            });
            // Si la API devuelve un array vacío o error, usamos el local
            if(res.data && res.data.length > 0) {
                 setCartasDisponibles(res.data);
            } else {
                 throw new Error("API vacía");
            }
        } catch (error) {
            console.log("⚠️ Usando cartas locales (API no disponible):", error.message);
            setCartasDisponibles(CARTAS_DISPONIBLES);
        }
    };

    useEffect(() => {
        obtenerUsuario();
        obtenerCartasOficiales();
    }, []);

    // ... FUNCIONES DE CREACIÓN (Igual que antes) ...
    const toggleCarta = (carta) => {
        if (cartasSeleccionadas.find(c => c.id === carta.id)) {
            setCartasSeleccionadas(cartasSeleccionadas.filter(c => c.id !== carta.id));
        } else {
            if (cartasSeleccionadas.length < 8) setCartasSeleccionadas([...cartasSeleccionadas, carta]);
            else alert("Máximo 8 cartas");
        }
    };

    const guardarMazo = async () => {
        if (!nuevoMazoNombre.trim() || cartasSeleccionadas.length !== 8) return alert("Nombre y 8 cartas obligatorios");
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.put('/api/usuarios/agregar-mazo', {
                nombreMazo: nuevoMazoNombre,
                cartas: cartasSeleccionadas
            }, { headers: { 'x-auth-token': token } });
            
            alert("¡Mazo Guardado!");
            setModoCrear(false);
            setCartasSeleccionadas([]);
            setNuevoMazoNombre('');
            obtenerUsuario(); // <--- IMPORTANTE: Recargar lista
        } catch (error) {
            alert("Error al guardar");
        }
    };

    const eliminarMazo = async (id) => {
        if(!window.confirm("¿Borrar mazo?")) return;
        try {
            const token = localStorage.getItem('token');
            await clienteAxios.delete(`/api/usuarios/eliminar-mazo/${id}`, {
                headers: { 'x-auth-token': token }
            });
            obtenerUsuario();
        } catch (error) { console.error(error); }
    };

    const promedioElixir = () => {
        if (cartasSeleccionadas.length === 0) return 0;
        const total = cartasSeleccionadas.reduce((acc, curr) => acc + curr.elixir, 0);
        return (total / cartasSeleccionadas.length).toFixed(1);
    };

    // --- RENDERIZADO DE EMERGENCIA SI HAY ERROR ---
    if (errorCritico) {
        return (
            <div style={{padding: '50px', textAlign: 'center', color: 'white', backgroundColor: '#e74c3c', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <h1>⚠ ERROR DE SESIÓN</h1>
                <p>Necesitamos actualizar tus datos de acceso.</p>
                <button 
                    onClick={forzarCierre}
                    className="btn-primary"
                    style={{padding: '15px 30px', marginTop: '20px', backgroundColor: 'white', color: '#e74c3c', border: 'none'}}
                >
                    🔄 REPARAR AHORA
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{color: 'var(--clash-blue-dark)'}}>Mis Mazos ({usuario?.mazos?.length || 0})</h1>
                {!modoCrear && (
                    <button onClick={() => setModoCrear(true)} className="btn-primary">
                        + NUEVO MAZO
                    </button>
                )}
            </div>

            {/* MODO CREAR */}
            {modoCrear ? (
                <div className="clash-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                        <h2 style={{margin: 0}}>Constructor de Mazo</h2>
                        <button onClick={()=>setModoCrear(false)} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>Cerrar</button>
                    </div>

                    <div style={{display:'flex', gap: '10px', marginBottom: '15px'}}>
                        <input type="text" placeholder="Nombre del Mazo" value={nuevoMazoNombre} onChange={e=>setNuevoMazoNombre(e.target.value)} style={{flex: 1}}/>
                        <button onClick={guardarMazo} className="btn-primary" style={{backgroundColor: '#2ecc71'}}>GUARDAR</button>
                    </div>
                    
                    <p style={{fontWeight: 'bold', color: '#8e44ad'}}>💧 Coste Medio: {promedioElixir()}</p>
                    
                    {/* TU SELECCIÓN */}
                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px', height: '120px', background: '#f0f2f5', padding: '10px', borderRadius: '10px', overflowX: 'auto'}}>
                        {cartasSeleccionadas.map(c => (
                            <img key={c.id} src={c.imagen} alt={c.nombre} style={{height: '100%', cursor: 'pointer', borderRadius: '5px'}} onClick={()=>toggleCarta(c)} />
                        ))}
                        {[...Array(8 - cartasSeleccionadas.length)].map((_, i) => (
                             <div key={i} style={{height: '100%', width: '90px', border: '2px dashed #ccc', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc'}}>Carta</div>
                        ))}
                    </div>

                    {/* TODAS LAS CARTAS */}
                    <h3 style={{marginTop: 0}}>Colección</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', maxHeight: '400px', overflowY: 'auto', padding: '5px'}}>
                        {cartasDisponibles.map(c => {
                            const isSelected = cartasSeleccionadas.find(sel => sel.id === c.id);
                            return (
                                <div key={c.id} style={{position: 'relative'}}>
                                    <img 
                                        src={c.imagen} 
                                        alt={c.nombre} 
                                        style={{
                                            width: '100%', 
                                            opacity: isSelected ? 0.4 : 1, 
                                            cursor: 'pointer', 
                                            borderRadius: '4px',
                                            transform: isSelected ? 'scale(0.9)' : 'scale(1)',
                                            transition: 'transform 0.1s'
                                        }}
                                        onClick={()=>toggleCarta(c)} 
                                    />
                                    {isSelected && <div style={{position: 'absolute', top: 0, right: 0, background: '#2ecc71', color: 'white', borderRadius: '50%', width: '20px', height: '20px', textAlign: 'center', lineHeight: '20px'}}>✓</div>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                /* LISTA DE MAZOS */
                <div className="card-container">
                    {usuario?.mazos?.length === 0 && <p style={{color: '#777'}}>No tienes mazos. ¡Crea uno!</p>}
                    
                    {usuario?.mazos?.map((mazo) => (
                        <div key={mazo._id} className="clash-card">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                <h3 style={{margin:0}}>{mazo.nombreMazo}</h3>
                                <button onClick={() => eliminarMazo(mazo._id)} style={{background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px'}}>🗑</button>
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