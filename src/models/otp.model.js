import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    otpHashed:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
    
},{timestamps:true})

const OtpModel = mongoose.model("Otp",otpSchema);
export default OtpModel;