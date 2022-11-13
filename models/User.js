import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    interrogatoQuestaSettimana: {
        type: Boolean,
        default: false
    },
    interrogazioniFatte: {
        type: [
            {
                materia: String,
                data: Date
            }
        ],
        default: []
    },
    interrogazioniDaFare: {
        type: [
            {
                materia: String,
                data: Date
            }
        ],
        default: []
    },
    fromGoogle: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default mongoose.model('User', UserSchema)