const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const auth = require('../middleware/auth');

// Obtener perfil de CUALQUIER usuario (Público)
router.get('/:id', auth, async (req, res) => {
    try {
        // Buscamos al usuario por ID
        // .select('-password') quita la contraseña por seguridad
        // Nos aseguramos de traer los 'mazos'
        const usuario = await Usuario.findById(req.params.id).select('-password');
        
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        // Devolvemos el usuario completo con sus mazos
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error del servidor al obtener perfil');
    }
});

// ... (Mantén aquí abajo tus rutas de agregar-mazo y eliminar-mazo tal cual las tenías) ...

// AGREGAR UN NUEVO MAZO
router.put('/agregar-mazo', auth, async (req, res) => {
    try {
        const { nombreMazo, cartas } = req.body;
        if (!nombreMazo || !cartas || cartas.length !== 8) {
            return res.status(400).json({ msg: 'El mazo debe tener nombre y exactamente 8 cartas' });
        }
        const usuario = await Usuario.findById(req.usuario.id);
        const nuevoMazo = {
            nombreMazo,
            cartas: cartas.map(c => ({
                nombre: c.nombre,
                elixir: c.elixir,
                nivel: c.nivel || 11,
                imagen: c.imagen 
            }))
        };
        usuario.mazos.push(nuevoMazo);
        await usuario.save();
        res.json(usuario.mazos);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar');
    }
});

// ELIMINAR MAZO
router.delete('/eliminar-mazo/:mazoId', auth, async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id);
        usuario.mazos = usuario.mazos.filter(m => m._id.toString() !== req.params.mazoId);
        await usuario.save();
        res.json(usuario.mazos);
    } catch (error) {
        res.status(500).send('Error al eliminar');
    }
});

module.exports = router;