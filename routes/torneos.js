const express = require('express');
const router = express.Router();
const Torneo = require('../models/Torneo');
const Partido = require('../models/Partido'); // IMPORTANTE: Importado una sola vez aquí arriba
const auth = require('../middleware/auth');

// 1. OBTENER TODOS LOS TORNEOS
router.get('/', auth, async (req, res) => {
  try {
    const torneos = await Torneo.find()
      .populate('creador', 'nombre tagClash')
      .populate('participantes.jugador', 'nombre tagClash');
    res.json({ torneos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener torneos' });
  }
});

// 2. CREAR TORNEO
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

// 3. UNIRSE A TORNEO
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

// 4. OBTENER DETALLES (ID)
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

// 5. ELIMINAR TORNEO
router.delete('/:id', auth, async (req, res) => {
    try {
        const torneo = await Torneo.findById(req.params.id);

        if (!torneo) {
            return res.status(404).json({ msg: 'Torneo no encontrado' });
        }

        // Verificar que quien borra es el creador
        if (torneo.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No tienes permiso para borrar esto' });
        }

        // 1º Borramos los partidos del torneo (Limpieza)
        await Partido.deleteMany({ torneo: req.params.id });

        // 2º Borramos el torneo
        await Torneo.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Torneo eliminado correctamente' });
        
    } catch (error) {
        console.error("🔴 ERROR EN DELETE:", error);
        // Devolvemos JSON siempre para evitar el error "undefined"
        res.status(500).json({ msg: 'Error del servidor: ' + error.message });
    }
});

module.exports = router;