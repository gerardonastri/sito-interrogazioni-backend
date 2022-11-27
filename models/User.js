import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nome: {
        type: String
    },
    cognome: {
        type: String
    },
    telefono: {
        type: String
    },
    email: {
        type: String,
        required: true
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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

export default mongoose.model('User', UserSchema)