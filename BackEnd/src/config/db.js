import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cafecitofeliz');
        console.log('✅ Base de Datos Conectada Exitosamente');
    } catch (error) {
        console.log('❌ Error al conectar DB:', error);
        process.exit(1);
    }
};

export default conectarDB;