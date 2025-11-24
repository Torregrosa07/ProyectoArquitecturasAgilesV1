const mongoose = require('mongoose');

// 1. Esquema de las cartas (para que se guarden dentro del mazo)
const tarjetaSchema = new mongoose.Schema({
  nombre: String, 
  nivel: Number,
  elixir: Number
});

// 2. Esquema del Mazo
const mazoSchema = new mongoose.Schema({
  nombreMazo: String,
  cartas: [tarjetaSchema] // Array de cartas
});

// 3. Esquema PRINCIPAL del Usuario
const usuarioSchema = new mongoose.Schema({
  // Datos de Login
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Datos del Perfil (Cambiamos nombreUsuario por nombre)
  nombre: { type: String, required: true }, 
  tagClash: { type: String, required: true }, 
  edad: Number,
  nacionalidad: String,
  modalidad_preferida: String,
  
  // Mazos guardados dentro del usuario
  mazos: [mazoSchema],
  
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);