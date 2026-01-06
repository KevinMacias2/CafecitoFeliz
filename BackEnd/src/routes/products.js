import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

// Definimos las rutas
// GET /api/products
router.get('/', productController.getProducts);

// POST /api/products
router.post('/', productController.createProduct);

// PUT /api/products/:id  (El :id es una variable en la URL)
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', productController.deleteProduct);

export default router;