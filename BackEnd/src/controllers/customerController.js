import Customer from '../models/customer.js';

// 1. Obtener clientes (con búsqueda)
export const getCustomers = async (req, res) => {
    try {
        const { q } = req.query;
        let query = {};

        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { phoneOrEmail: { $regex: q, $options: 'i' } }
            ];
        }

        const customers = await Customer.find(query);
        res.json({ items: customers, total: customers.length });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener clientes' });
    }
};

// 2. Crear cliente
export const createCustomer = async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(400).json({ msg: 'Error al crear cliente', error });
    }
};

// 3. Obtener cliente por ID
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ msg: 'Cliente no encontrado' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ msg: 'Error del servidor' });
    }
};