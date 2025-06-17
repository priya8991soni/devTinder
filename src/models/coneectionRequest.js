const mongoose=require('mongoose')

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum:{
            values:['ignored','interested','accepted','rejected'],
            message:`{VALUE} is incorrect status type`
        }
    }
},{timeseries:true})

connectionRequestSchema.pre('save', function (next){
    const connectionRequest=this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('cannot send connection request to youself!')
    }
    next()
})

module.exports=new mongoose.model('ConnectionRequest',connectionRequestSchema)