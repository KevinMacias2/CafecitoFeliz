import Product from '../models/product.js';

// 1. Obtener productos (con búsqueda opcional ?q=nombre)
export const getProducts = async (req, res) => {
    try {
        const { q } = req.query; // Capturamos el parámetro "q" de la URL
        let query = {};

        // Si envían una búsqueda, filtramos por nombre (insensible a mayúsculas)
        if (q) {
            query.name = { $regex: q, $options: 'i' };
        }

        const products = await Product.find(query);

        res.json({
            items: products,
            total: products.length
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener productos' });
    }
};

// 2. Crear un producto
export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ msg: 'Error al crear producto', error });
    }
};

// 3. Actualizar producto
export const updateProduct = async (req, res) => {
    try {
        // new: true devuelve el producto YA actualizado, no el viejo
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ msg: 'Error al actualizar' });
    }
};

// 4. Eliminar producto
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar' });
    }
};