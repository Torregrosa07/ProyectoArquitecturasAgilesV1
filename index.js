const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. IMPORTAR RUTAS
const authRoutes = require('./routes/auth');
const torneosRoutes = require('./routes/torneos');
const partidosRoutes = require('./routes/partidos'); 
const usuariosRoutes = require('./routes/usuarios'); 
const clashRoutes = require('./routes/clash'); // <--- AÑADIR ESTO

const app = express();

// 2. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. DEFINIR RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/torneos', torneosRoutes);
app.use('/api/partidos', partidosRoutes); 
app.use('/api/usuarios', usuariosRoutes); 
app.use('/api/clash', clashRoutes);

// 4. CONEXIÓN BASE DE DATOS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado a MongoDB Atlas"))
  .catch((err) => console.error("🔴 Error Mongo:", err));

// 5. ARRANCAR SERVIDOR
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));