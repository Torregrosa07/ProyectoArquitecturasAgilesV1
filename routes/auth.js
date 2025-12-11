const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO
router.post('/registro', async (req, res) => {
  try {
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({ email });
    if (usuario) return res.status(400).json({ msg: "El usuario ya existe" });

    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    await usuario.save();

    // Crear y firmar el JWT (Token)
    const payload = { usuario: { id: usuario.id } };
    jwt.sign(payload, process.env.SECRETA, { expiresIn: 360000 }, (error, token) => {
        if(error) throw error;
        res.json({ token }); // Devolvemos el token al frontend
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: "El usuario no existe" });

    // Revisar contraseña encriptada
    const passCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passCorrecto) return res.status(400).json({ msg: "Password Incorrecto" });

    // Si todo ok, crear y firmar el JWT
    const payload = { usuario: { id: usuario.id } };
    jwt.sign(payload, process.env.SECRETA, { expiresIn: 360000 }, (error, token) => {
        if(error) throw error;
        res.json({ token, usuario: { nombre: usuario.nombre, email: usuario.email } });
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

module.exports = router;