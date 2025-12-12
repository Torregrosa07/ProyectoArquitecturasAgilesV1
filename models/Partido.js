const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
    torneo: { type: mongoose.Schema.Types.ObjectId, ref: 'Torneo', required: true },
    ronda: { type: Number, required: true },
    jugador1: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    jugador2: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    ganador: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    marcador: {
        coronasJ1: { type: Number, default: 0 },
        coronasJ2: { type: Number, default: 0 }
    },
    jugado: { type: Boolean, default: false }
});

module.exports = mongoose.model('Partido', PartidoSchema);