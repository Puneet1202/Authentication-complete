import UserModel from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";




/**
 * @description Register a new user
 * @route Post /api/auth/register
 * @access Public
 */

export const authcontroller = async(req, res) => {
  const {username,email,password}= req.body;
  try{
    const isAlreadyExist = await UserModel.findOne({
        $or:[{username},{email}]
    })
    if(isAlreadyExist){
        return res.status(409).json({message:"User already exists"})
    }
    const newUser=  new UserModel({
        username,
        email,
        password
    })

    const token = jwt.sign({id:newUser._id},config.JWT_SCERET,{expiresIn:config.JWT_EXPIRES_IN})
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:60*60*1000
    })
    await newUser.save();
    return res.status(201).json({message:"user created successfully ", newUser,token})
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }
}

/**
 * @description Login a user
 * @route Post /api/auth/login
 * @access Public
 */

export const loginController = async(req, res) => {
  const {username,email,password}=req.body;
  try{
    const  orCondition = [];

    if (username) orCondition.push({username})
    if (email) orCondition.push({email})
      if(orCondition.length===0){
        return res.status(400).json({message:"Please provide username or email"})
      }

    const user = await UserModel.findOne({$or:orCondition})
    if(!user){
      return res.status(404).json({message:"User not found"})
    }
    if(user.password !== password){
      return res.status(401).json({message:"Invalid password"})
    }
    const token = jwt.sign({id:user._id},config.JWT_SCERET,{expiresIn:config.JWT_EXPIRES_IN})
    res.cookie("token",token,{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      maxAge:60*60*1000
    })
    return res.status(200).json({message:"User logged in successfully",user,token})

  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }

 
}

