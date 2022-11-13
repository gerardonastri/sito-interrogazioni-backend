import express from 'express'
const router = express.Router()
import Estrazione from '../models/Estrazione.js'
import User from '../models/User.js'


//get
router.get('/', async (req,res) => {
    const estrazione = await Estrazione.findOne()
    res.status(200).json(estrazione)
})

//create
router.post("/", async (req,res) => {
    //prende gli user interrogabili
    const {users, quantita, materia, data} = req.body;
    const interrogati = []

    while(interrogati.length < quantita){
        let interrogato = Math.floor(Math.random() * users.length)
        if(!interrogati.includes(users[interrogato])){
            interrogati.push(users[interrogato]);
        } 
    }

    interrogati.forEach(interrogato =>  {
        aggiungiInerrogazione(interrogato, materia, data)
    })

    const estrazione = await Estrazione.create({estratti: interrogati})
    res.status(200).json(estrazione)
})

const aggiungiInerrogazione = async (interrogato, materia, data) => {
    const user = await User.findById(interrogato._id)
    const nuoveInterrogazioni = user.interrogazioniDaFare;
    nuoveInterrogazioni.push({materia, data})
    user.interrogazioniDaFare = nuoveInterrogazioni
    await user.save()
}


export default router;