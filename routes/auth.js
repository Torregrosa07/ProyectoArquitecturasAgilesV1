const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.post('/registro', async (req, res) => {
  try {
    const { email } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: "El email ya existe" });

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Registrado", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario || usuario.password !== password) {
      return res.status(400).json({ mensaje: "Credenciales incorrectas" });
    }
    res.json({ mensaje: "Login exitoso", usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;