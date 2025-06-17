const express=require('express')
const connectDB=require('./config/database')
const User = require('./models/user')
const {validateSignUpData}=require('./utils/validations')
const cookieParser=require('cookie-parser')

const {userAuth}=require('./middlewares/auth')

const app=express()

app.use(express.json())
app.use(cookieParser())

const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/request')
const userRouter = require('./routes/user')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)

connectDB().then(()=>{
    console.log('database connection established')
    app.listen(3000,()=>console.log('server running'))
})
.catch(err=>console.log('something went wrong while connecting to DB'))

