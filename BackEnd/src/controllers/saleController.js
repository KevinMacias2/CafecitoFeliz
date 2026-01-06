import Sale from '../models/sale.js';
import Product from '../models/product.js';
import Customer from '../models/customer.js';

// 1. Crear Venta
export const createSale = async (req, res) => {
    try {
        const { items, customerId, paymentMethod } = req.body;

        // A. Validaciones y Cálculo de Items
        let subtotal = 0;
        const saleItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ msg: `Producto ${item.productId} no encontrado` });
            }

            // Validar stock (Opcional según tu doc, pero recomendado)
            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Stock insuficiente para ${product.name}` });
            }

            // Cálculos
            const unitPrice = product.price;
            const lineTotal = unitPrice * item.quantity; // Calculamos el total de línea

            subtotal += lineTotal;

            // Preparamos el item con Snapshots
            saleItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                price: unitPrice,
                lineTotal: lineTotal // Guardamos el total de línea
            });

            // (Opcional) Restar stock aquí si lo deseas
            product.stock -= item.quantity;
            await product.save();
        }

        // B. Calcular Descuento (Regla de negocio)
        let discountPercent = 0; // Se guarda como 0, 5, 10, 15
        let customer = null;

        if (customerId) {
            customer = await Customer.findById(customerId);
            if (customer) {
                const count = customer.purchasesCount;

                // Reglas de negocio:
                if (count >= 1 && count <= 3) discountPercent = 5;
                else if (count >= 4 && count <= 7) discountPercent = 10;
                else if (count >= 8) discountPercent = 15;
            }
        }

        // Matemáticas finales
        // Convertimos el porcentaje (ej: 10) a decimal (0.10) para calcular el monto
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal - discountAmount;

        // C. Guardar la Venta
        const newSale = new Sale({
            customer: customerId || null,
            items: saleItems,
            subtotal,
            discountPercent, // Guardamos el % (ej: 10)
            discountAmount,  // Guardamos el monto (ej: 50.00)
            total,
            paymentMethod: paymentMethod || 'cash'
        });

        await newSale.save();

        // D. Actualizar contador del cliente
        if (customer) {
            customer.purchasesCount += 1;
            await customer.save();
        }

        res.status(201).json(newSale);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al registrar venta', error });
    }
};

// 2. Obtener detalle de venta (Ticket)
export const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('customer', 'name phoneOrEmail')
            .populate('items.product', 'name');

        if (!sale) return res.status(404).json({ msg: 'Venta no encontrada' });

        res.json(sale);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener venta' });
    }
};