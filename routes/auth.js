import express from 'express'
const router = express.Router()
import User from '../models/User.js'
import bcrypt from "bcryptjs"
import {createError} from '../error.js'
import jwt  from 'jsonwebtoken'

//google auth
router.post("/", async (req,res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})

        if(user){
            const token = jwt.sign({ id: user._id }, process.env.SECRET);
        
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(user._doc);
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()

            const token = jwt.sign({ id: savedUser._id }, process.env.SECRET);
        
            res.cookie("access_token", token, {
                httpOnly: true,
            }).status(200).json(savedUser._doc);
        }
        
    } catch (error) {
        next(error)
    }
})

//register
router.post('/register', async (req,res,next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)
        const newUser = new User({...req.body, password: hashedPassword })

        await newUser.save();
        
        res.status(200).json(newUser)

    } catch (error) {
        next(error)
    }
})



//login
router.post('/login', async (req,res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found!"));
    
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
    
        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
    
        const token = jwt.sign({ id: user._id }, process.env.SECRET);
        const { password, ...others } = user._doc;
    
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(others);
  
  
      } catch (error) {
          next(error)
      }
})

export default router