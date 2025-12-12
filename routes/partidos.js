const express = require('express');
const router = express.Router();
const Partido = require('../models/Partido');
const Torneo = require('../models/Torneo');
const auth = require('../middleware/auth');

// Generar Brackets (Ronda 1) al iniciar torneo
router.post('/generar/:idTorneo', auth, async (req, res) => {
    try {
        const torneo = await Torneo.findById(req.params.idTorneo).populate('participantes.jugador');
        if (!torneo) return res.status(404).json({ msg: 'Torneo no encontrado' });
        
        // Verificar si es el creador quien intenta iniciar
        if (torneo.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado para iniciar este torneo' });
        }

        // Si el torneo ya está en curso o finalizado, no generar de nuevo
        if (torneo.estado !== 'abierto') {
            return res.status(400).json({ msg: 'El torneo ya ha comenzado' });
        }

        // Mezclar jugadores aleatoriamente
        const jugadores = torneo.participantes.map(p => p.jugador._id)
                                .sort(() => Math.random() - 0.5);

        if (jugadores.length < 2) {
            return res.status(400).json({ msg: 'Se necesitan al menos 2 jugadores para iniciar' });
        }

        // Crear enfrentamientos (Ronda 1)
        const partidas = [];
        for (let i = 0; i < jugadores.length; i += 2) {
            if (jugadores[i + 1]) { // Si hay pareja
                const nuevaPartida = new Partido({
                    torneo: torneo._id,
                    jugador1: jugadores[i],
                    jugador2: jugadores[i + 1]
                });
                partidas.push(nuevaPartida);
            } else {
                // Lógica para jugador impar (pasa directo o "bye") - Opcional
                // Por ahora lo ignoramos o podrías darle victoria automática
            }
        }

        await Partido.insertMany(partidas);
        
        // Actualizar estado del torneo
        torneo.estado = 'en curso';
        await torneo.save();

        res.json({ msg: 'Torneo iniciado y brackets generados', partidas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al generar partidas');
    }
});

// Obtener todas las partidas de un torneo específico
router.get('/torneo/:idTorneo', auth, async (req, res) => {
    try {
        const partidas = await Partido.find({ torneo: req.params.idTorneo })
            .populate('jugador1', 'nombre tagClash')
            .populate('jugador2', 'nombre tagClash')
            .populate('ganador', 'nombre');
        res.json(partidas);
    } catch (error) {
        res.status(500).send('Error al obtener partidas');
    }
});

// Actualizar resultado de una partida (Marcador y Ganador)
router.put('/:id', auth, async (req, res) => {
    const { coronasJ1, coronasJ2, ganadorId } = req.body;
    try {
        let partida = await Partido.findById(req.params.id);
        if (!partida) return res.status(404).json({ msg: 'Partida no encontrada' });

        // Actualizar datos
        if (coronasJ1 !== undefined) partida.marcador.coronasJ1 = coronasJ1;
        if (coronasJ2 !== undefined) partida.marcador.coronasJ2 = coronasJ2;
        if (ganadorId) partida.ganador = ganadorId;

        await partida.save();
        res.json(partida);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando partida');
    }
});

// ESTA LÍNEA ES CRUCIAL PARA EVITAR EL ERROR EN index.js
module.exports = router;