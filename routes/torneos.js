const express = require('express');
const router = express.Router();
const Torneo = require('../models/Torneo');

router.get('/', async (req, res) => {
  try {
    const torneos = await Torneo.find()
      .populate('creador', 'nombre tagClash')
      .populate('participantes.jugador', 'nombre tagClash');
    res.json(torneos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoTorneo = new Torneo(req.body);
    const guardado = await nuevoTorneo.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/unirse/:idTorneo', async (req, res) => {
  const { idUsuario } = req.body;
  try {
    const torneo = await Torneo.findById(req.params.idTorneo);
    if (!torneo) return res.status(404).json({ mensaje: "Torneo no encontrado" });

    const yaInscrito = torneo.participantes.some(p => p.jugador.toString() === idUsuario);
    if (yaInscrito) return res.status(400).json({ mensaje: "Ya estás inscrito" });

    torneo.participantes.push({ jugador: idUsuario });
    await torneo.save();
    res.json({ mensaje: "Inscripción exitosa", torneo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;