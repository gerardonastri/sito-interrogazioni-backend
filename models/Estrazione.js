import mongoose from "mongoose";

const EstrazioneSchema = new mongoose.Schema({
    estratti: {
        type: Object
    },
    orarioEstrazione: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

export default mongoose.model('Estrazione', EstrazioneSchema)