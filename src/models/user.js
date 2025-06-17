const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        minLength:4,
        maxLength:50
    },
    emailId:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email id')
            }
        }
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    },
})

userSchema.methods.getJWT=async function(){
    const user=this
    const token=jwt.sign({_id:user._id},"harekrsna")
    return  token
}

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this

    const isPasswordValid=await bcrypt.compare(passwordInputByUser,user.password)
    return isPasswordValid
}

module.exports=mongoose.model('User',userSchema)