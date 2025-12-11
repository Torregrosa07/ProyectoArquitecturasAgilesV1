import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import clienteAxios from '../config/axios';

const Torneos = () => {
    const [torneos, setTorneos] = useState([]);

    useEffect(() => {
        const obtenerTorneos = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) return;

                const respuesta = await clienteAxios.get('/api/torneos', {
                    headers: { 'x-auth-token': token }
                });
                // Ajustamos según la respuesta del backend
                setTorneos(respuesta.data.torneos || respuesta.data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerTorneos();
    }, []);

    return ( 
        <>
            <Header />
            <div style={{ padding: '2rem' }}>
                <h1 className="text-center">Mis Torneos</h1>
                
                {torneos.length === 0 ? (
                    <p>No hay torneos disponibles.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {torneos.map(torneo => (
                            <div key={torneo._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '5px' }}>
                                <h3>{torneo.nombre}</h3>
                                <p><strong>Tipo:</strong> {torneo.tipo}</p>
                                <p><strong>Creador:</strong> {torneo.creador?.nombre || 'Desconocido'}</p>
                                <p><strong>Participantes:</strong> {torneo.participantes.length}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
     );
}
 
export default Torneos;