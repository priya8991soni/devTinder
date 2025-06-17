const express=require('express')
const bcrypt=require('bcrypt')
const User = require('../models/user')
const jwt=require('jsonwebtoken')
const { validateSignUpData } = require('../utils/validations')
const authRouter=express.Router()

authRouter.post('/signup',async(req,res)=>{

    const {password,firstName,lastName,emailId}=req.body

    const passwordHash=await bcrypt.hash(password,10)
    console.log(passwordHash)

    try{
        validateSignUpData(req)
        const user=new User({
            firstName,lastName,emailId,password:passwordHash
        })
        await user.save()
        res.send('new user created')
    }
    catch(err){
        res.status(400).send('error occured:' + err.message)
    }
    
})

authRouter.post('/login',async(req,res)=>{
    const {emailId, password}=req.body
    try{
        const user= await User.findOne({emailId:emailId})
        if(!user){
            throw new Error('user doen not exist')
        }
        const isPasswordValid=await user.validatePassword(password)
        if(isPasswordValid){
            //create a jwt token

            const token=await user.getJWT()
            
            console.log('token',token)
            //add the token in cookie and send the response back to the user

            res.cookie('token',token)
            res.send('login successful')
        }
        else{
            throw new Error('passwor not matched')
        }
    }
    catch(err){
        console.log('error: '+ err.message)
    }
   
})

authRouter.post('/logout',(req,res)=>{
    res.cookie('token',null)
    res.send('logged  out')
})

module.exports=authRouter