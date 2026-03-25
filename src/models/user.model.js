import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username already exists"],
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"],
        trim:true,
        lowercase:true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true,
        minlength:[6,"Password must be at least 6 characters long"]
    }
})


const UserModel = mongoose.model("User",userSchema);
export default UserModel;