import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import estrazioneRoutes from './routes/estrazione.js'
import mongoose from 'mongoose'

dotenv.config()
const app = express()


//mongoose
const connect = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('connected to db');
    }).catch((err) => {
        throw err;
    })
}


//middleware
app.use(cookieParser())
app.use(cors({ credentials: true, origin: "*" }))
app.use(express.json())




//routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/estrazione", estrazioneRoutes)


app.use((err, req,res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })

})


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connect()
    console.log(`server listening on port ${PORT}`);
})