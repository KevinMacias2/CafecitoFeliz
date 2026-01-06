import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Elimina espacios vacíos al inicio y final
    },
    price: {
        type: Number,
        required: true,
        min: 0 // No permitimos precios negativos
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

export default mongoose.model('product', ProductSchema);