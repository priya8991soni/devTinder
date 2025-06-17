const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/coneectionRequest');
const user = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus=['interested','ignored']
        if(!allowedStatus.includes(status)){
            res.status(400).json({message:'invalid status type '+ status})
        }

        const toUser=await user.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message:'user not found'})
        }

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).send({
                message:'connection request already exists'
            })
        }

        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        const data = await connectionRequest.save();

        console.log('first', data);

        return res.json({
            message: req.user.firstName+ " is "+ status+ " in "+ toUser.firstName,
            data
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Failed to send connection request',
            error: err.message
        });
    }
});

requestRouter.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
    const {status,requestId}=req.params

    const allowedStatus=['accepted','rejected']
    if(!allowedStatus.includes(status)){
       return  res.status(400).json({message:'status not allowed'})
    }
    console.log('loggedInUser',loggedInUser)

    const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:'interested'
    })
    console.log('connectionRequest',connectionRequest)

    if(!connectionRequest){
        return res.status(404).json({message:'connection request not found'})
    } 

    connectionRequest.status=status 
    const data=await connectionRequest .save()
    console.log('data',data)

    res.json({message:'connection request '+ status,data})
    }
    catch(err){
        res.status(400).send('error occured: '+ err.message)
    }
})

module.exports = requestRouter;
