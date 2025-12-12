const express = require('express');
const router = express.Router();
const Torneo = require('../models/Torneo');
const Partido = require('../models/Partido'); // IMPORTANTE: Solo se declara aquí arriba
const auth = require('../middleware/auth');

// Obtener todos los torneos
router.get('/', auth, async (req, res) => {
  try {
    const torneos = await Torneo.find()
      .populate('creador', 'nombre tagClash')
      .populate('participantes.jugador', 'nombre tagClash');
    res.json({ torneos });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un torneo
router.post('/', auth, async (req, res) => {
  try {
    const nuevoTorneo = new Torneo(req.body);
    nuevoTorneo.creador = req.usuario.id; 
    
    const guardado = await nuevoTorneo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unirse a un torneo
router.put('/unirse/:idTorneo', auth, async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.idTorneo);
    if (!torneo) return res.status(404).json({ mensaje: "Torneo no encontrado" });

    const yaInscrito = torneo.participantes.some(p => p.jugador.toString() === req.usuario.id);
    if (yaInscrito) return res.status(400).json({ mensaje: "Ya estás inscrito" });

    torneo.participantes.push({ jugador: req.usuario.id });
    await torneo.save();
    res.json({ mensaje: "Inscripción exitosa", torneo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener detalles de un torneo específico
router.get('/:id', auth, async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id)
      .populate('creador', 'nombre')
      .populate('participantes.jugador', 'nombre tagClash nacionalidad');
      
    if (!torneo) return res.status(404).json({ mensaje: 'Torneo no encontrado' });
    
    res.json(torneo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ELIMINAR TORNEO (Solo el creador)
router.delete('/:id', auth, async (req, res) => {
    try {
        const torneo = await Torneo.findById(req.params.id);

        if (!torneo) {
            return res.status(404).json({ msg: 'Torneo no encontrado' });
        }

        // Verificar creador
        if (torneo.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No autorizado para eliminar este torneo' });
        }

        // 1. Eliminar partidos asociados
        await Partido.deleteMany({ torneo: req.params.id });

        // 2. Eliminar torneo
        await Torneo.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Torneo eliminado correctamente' });
        
    } catch (error) {
        console.error("🔴 ERROR EN DELETE:", error);
        res.status(500).json({ msg: 'Error del servidor: ' + error.message });
    }
});

module.exports = router;