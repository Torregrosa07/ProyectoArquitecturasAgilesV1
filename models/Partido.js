const mongoose = require('mongoose');

const partidaSchema = new mongoose.Schema({
  torneo: { type: mongoose.Schema.Types.ObjectId, ref: 'Torneo', required: true },
  
  jugador1: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  jugador2: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  
  ganador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }, // Puede ser null si es empate o no ha jugado
  
  marcador: { // Tu campo "marcador"
    coronasJ1: { type: Number, default: 0 },
    coronasJ2: { type: Number, default: 0 }
  },
  
  fechaJugada: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partida', partidaSchema);