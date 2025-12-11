const express = require('express');
const router = express.Router();
const Torneo = require('../models/Torneo');
const auth = require('../middleware/auth'); // Importar middleware

// Obtener todos los torneos (Ruta protegida, solo usuarios logueados pueden verlos)
router.get('/', auth, async (req, res) => {
  try {
    const torneos = await Torneo.find()
      .populate('creador', 'nombre tagClash')
      .populate('participantes.jugador', 'nombre tagClash');
    res.json({ torneos }); // Devuelvo un objeto { torneos: [...] } para consistencia
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un torneo (Ruta protegida)
router.post('/', auth, async (req, res) => {
  try {
    // Añadimos el creador basado en el token
    const nuevoTorneo = new Torneo(req.body);
    nuevoTorneo.creador = req.usuario.id; 
    
    const guardado = await nuevoTorneo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unirse a un torneo (Ruta protegida)
router.put('/unirse/:idTorneo', auth, async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.idTorneo);
    if (!torneo) return res.status(404).json({ mensaje: "Torneo no encontrado" });

    // Verificar si el usuario ya está inscrito usando el ID del token
    const yaInscrito = torneo.participantes.some(p => p.jugador.toString() === req.usuario.id);
    if (yaInscrito) return res.status(400).json({ mensaje: "Ya estás inscrito" });

    torneo.participantes.push({ jugador: req.usuario.id });
    await torneo.save();
    res.json({ mensaje: "Inscripción exitosa", torneo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;