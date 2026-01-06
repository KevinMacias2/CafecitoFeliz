const mongoose = require('mongoose');
import dotenv from "dotenv";

dotenv.config();

const conectarDB = async () => {
    try {
        // Por ahora usaremos una conexión local. 
        // Si tienes Mongo Atlas (nube), cambiarás esta URL después.
        await mongoose.connect('mongodb://127.0.0.1:27017/cafecitofeliz');
        
        console.log('✅ Base de Datos Conectada Exitosamente');
    } catch (error) {
        console.log('❌ Error al conectar DB:', error);
        process.exit(1); // Detiene la app si no hay base de datos
    }
}

module.exports = conectarDB;