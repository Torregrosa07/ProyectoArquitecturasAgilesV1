const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
  jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fecha_inscripcion: { type: Date, default: Date.now }
});

const torneoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, required: true }, // Tu "fecha (timestamp)"
  cantidad_jugadores: { type: Number, default: 50 },
  modalidad: { type: String }, // Ej: "Elección", "Muerte Súbita"
  
  // El creador (Admin del torneo)
  creador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  
  // AQUÍ ESTÁ LA TABLA INSCRIPCIÓN DE TU DIAGRAMA
  participantes: [inscripcionSchema],
  
  estado: { type: String, enum: ['abierto', 'en curso', 'finalizado'], default: 'abierto' }
});

module.exports = mongoose.model('Torneo', torneoSchema);