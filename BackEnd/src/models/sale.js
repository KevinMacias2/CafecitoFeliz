import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String, // Snapshot del nombre (productNameSnapshot)
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true // Snapshot del precio unitario (unitPriceSnapshot)
            },
            lineTotal: {
                type: Number,
                required: true // NUEVO: Total de esta línea (precio * cantidad)
            }
        }
    ],
    subtotal: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 }, // NUEVO: Ej: 10 (para 10%)
    discountAmount: { type: Number, default: 0 },  // RENOMBRADO: Dinero descontado
    total: { type: Number, required: true },
    paymentMethod: {
        type: String,
        default: 'cash' // Ajustado a "cash" según tu documento
    }
}, {
    timestamps: true // Esto genera createdAt y updatedAt automáticamente
});

export default mongoose.model('Sale', SaleSchema);