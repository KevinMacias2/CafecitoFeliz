const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');

const app = express();
const port = 3000;

// 1. Conectar a Base de Datos
conectarDB();

// 2. Middleware
app.use(cors()); // Permite peticiones de Angular
app.use(express.json()); // Permite leer JSON

// 3. Rutas (Endpoints)
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/sales', require('./routes/sales'));

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('API CafecitoFeliz: Productos, Clientes y Ventas listos ☕');
});

// 4. Arrancar servidor
app.listen(port, () => {
    console.log(`🚀 Servidor listo en http://localhost:${port}`);
});