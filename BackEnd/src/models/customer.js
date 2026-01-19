import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneOrEmail: {
        type: String,
        required: true,
        unique: true // Evita duplicados (opcional, pero recomendado)
    },
    purchasesCount: {
        type: Number,
        default: 0 // Todo cliente nuevo empieza con 0 compras
    }
}, {
    timestamps: true
});

export default mongoose.model('customer', CustomerSchema);
