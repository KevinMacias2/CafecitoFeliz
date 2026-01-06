import express from 'express';
import cors from 'cors';
import conectarDB from './src/config/db.js';

import productRoutes from './src/routes/products.js';
import customerRoutes from './src/routes/customers.js';
import saleRoutes from './src/routes/sales.js';

const app = express();
const port = 3000;

// 1. Conectar DB
conectarDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Rutas
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', saleRoutes);

app.get('/', (req, res) => {
    res.send('API CafecitoFeliz funcionando con ES Modules ☕');
});

app.listen(port, () => {
    console.log(`🚀 Servidor listo en http://localhost:${port}`);
});