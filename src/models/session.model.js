import mongoose from "mongoose";


const sessionSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user is required"]
    },
    accessToken:{
        type:String,
        
    },
    refreshToken:{
        type:String,
        required:[true,"refreshToken is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now,

    },
    expiresAt:{
        type:Date,
        required:[true,"expiresAt is required"]
    },
    ipAddress:{
        type:String,
    },
    userAgent:{
        type:String,
    },
    revoked:{
        type:Boolean,
        default:false
    }

}, {timestamps:true})

sessionSchema.index({expiresAt:1},{expireAfterSeconds:0})
sessionSchema.index({revoked:1})


const SessionModel = mongoose.model("Session",sessionSchema)
export default SessionModel

