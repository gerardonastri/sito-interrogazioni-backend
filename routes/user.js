import express from 'express'
const router = express.Router()
import User from '../models/User.js'

//get all users
router.get('/', async (req,res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
})

//get single user
router.get('/find/:id', async (req,res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
})

//get user interrogabili
router.get("/interrogazione", async (req,res,next) => {
    const {materia} = req.query
    try {
        const usersToSend = []
        const users = await User.find({interrogatoQuestaSettimana: false});
        users.forEach(user => {
            if(user.interrogazioniFatte.length > 0){
                let puoEssereInterrogato = false
                user.interrogazioniFatte.forEach(interrogazione => {
                    if(interrogazione.materia == materia) {
                        puoEssereInterrogato = true
                    }
                })
                if(puoEssereInterrogato === false){
                    usersToSend.push(user)
                }
            } else {
                usersToSend.push(user)
            }
        })
        res.status(200).json(usersToSend)
    } catch (error) {
        next(error)
    }
})



// TODO: eliminare interrogazione
//  opzione 1:  un select con option che ha value della materia e 
//    nel backend prendiamo l'user, troviamo e togliamo la materia dall'array e lo salviamo.
//  opzione 2: facciamo un map per l'array delle interrogazioni e mettiamo 
//    al div contenitore come key la materia da eliminare e usiamo useRef() per prendere il valore.


//creare interrogazione
router.post("/creaInterrogazione/:id", async (req,res, next) => {
    const {type, materia, data} = req.body
    try {
        const user = await User.findById(req.params.id)
        if(type === "completed"){
            const nuoveInterrogazioni = user.interrogazioniFatte;
            nuoveInterrogazioni.push({materia, data})
            user.interrogazioniFatte = nuoveInterrogazioni
            await user.save()
        } else {
            const nuoveInterrogazioni = user.interrogazioniDaFare;
            nuoveInterrogazioni.push({materia, data})
            user.interrogazioniDaFare = nuoveInterrogazioni
            await user.save()
        }
        res.status(200).json("Interrogazione create")
    } catch (error) {
        next(error)
    }
})


//creare interrogazione
router.post("/completaInterrogazione/:id", async (req,res, next) => {
    const {type, materia, data, interrogazioneId} = req.body
    try {
        const user = await User.findById(req.params.id)
        const nuoveInterrogazioniDaFare = user.interrogazioniDaFare.filter(int => int._id != interrogazioneId)
        const nuoveInterrogazioniFatte = user.interrogazioniFatte;
        nuoveInterrogazioniFatte.push({materia, data})
            
        user.interrogazioniFatte = nuoveInterrogazioniFatte
        user.interrogazioniDaFare = nuoveInterrogazioniDaFare
        await user.save()

        res.status(200).json("Interrogazione create")
    } catch (error) {
        next(error)
    }
})


//eliminare interrogazione
router.post("/deleteInterrogazione/:id", async (req,res, next) => {
    const {type, interrogazioneId} = req.body
    try {
        const user = await User.findById(req.params.id)
        if(type === "completed"){
            const nuoveInterrogazioni = user.interrogazioniFatte.filter(int => int._id != interrogazioneId)
            user.interrogazioniFatte = nuoveInterrogazioni
            await user.save()
        } else {
            const nuoveInterrogazioni = user.interrogazioniDaFare.filter(int => int._id != interrogazioneId)
            user.interrogazioniDaFare = nuoveInterrogazioni
            await user.save()
        }
        res.status(200).json("Interrogazione eliminata")
    } catch (error) {
        next(error)
    }
})


export default router
