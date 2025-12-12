const mongoose = require('mongoose');

// 1. Esquema de las cartas (AÑADIMOS EL CAMPO IMAGEN)
const tarjetaSchema = new mongoose.Schema({
  nombre: String, 
  nivel: Number,
  elixir: Number,
  imagen: String // <--- ¡FALTABA ESTO!
});

// 2. Esquema del Mazo
const mazoSchema = new mongoose.Schema({
  nombreMazo: String,
  cartas: [tarjetaSchema]
});

// 3. Esquema PRINCIPAL del Usuario
const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: { type: String, required: true }, 
  tagClash: { type: String, required: true }, 
  edad: Number,
  nacionalidad: String,
  modalidad_preferida: String,
  
  mazos: [mazoSchema],
  
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);