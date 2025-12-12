const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// OBTENER USUARIO AUTENTICADO
router.get('/', auth, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// REGISTRO
router.post('/registro', async (req, res) => {
  try {
    const { email, password, nombre, tagClash } = req.body;
    let usuario = await Usuario.findOne({ email });
    if (usuario) return res.status(400).json({ msg: "El usuario ya existe" });

    usuario = new Usuario(req.body);
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    await usuario.save();

    const payload = { usuario: { id: usuario.id } };
    jwt.sign(payload, process.env.SECRETA, { expiresIn: 360000 }, (error, token) => {
        if(error) throw error;
        res.json({ 
            token, 
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, tagClash: usuario.tagClash } 
        }); 
    });
  } catch (error) {
    res.status(500).send('Error registro');
  }
});

// LOGIN (CON CHIVATO DE DEBUG)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: "El usuario no existe" });

    const passCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passCorrecto) return res.status(400).json({ msg: "Password Incorrecto" });

    const payload = { usuario: { id: usuario.id } };
    
    // --- CHIVATO DE CONSOLA ---
    console.log("🔑 LOGUEANDO USUARIO:", usuario.nombre);
    console.log("🆔 ID QUE SE VA A ENVIAR:", usuario.id);
    // --------------------------

    jwt.sign(payload, process.env.SECRETA, { expiresIn: 360000 }, (error, token) => {
        if(error) throw error;
        
        // RESPUESTA AL FRONTEND
        res.json({ 
            token, 
            usuario: { 
                id: usuario.id, // <--- ESTO ES LO IMPORTANTE
                nombre: usuario.nombre, 
                email: usuario.email,
                tagClash: usuario.tagClash
            } 
        });
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
});

module.exports = router;