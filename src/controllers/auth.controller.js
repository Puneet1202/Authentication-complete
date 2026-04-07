import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import SessionModel from "../models/session.model.js";
import crypto from "crypto";




/**
 * @description Register a new user
 * @route Post /api/auth/register
 * @access Public
 */

export const registerController = async(req, res) => {
  const dbsession= await mongoose.startSession();
  dbsession.startTransaction();
  const {username,email,password}= req.body;
  try{
    const isAlreadyExist = await UserModel.findOne({
        $or:[{username},{email}]
    }).session(dbsession)
    if(isAlreadyExist){
      await dbsession.abortTransaction(); 
        return res.status(409).json({message:"User already exists"})
    }
    const newUser=  new UserModel({
        username,
        email,
        password
    })
    await newUser.save({ session: dbsession });

    const refreshToken = jwt.sign({id:newUser._id},config.REFRESH_TOKEN,{expiresIn:config.REFRESH_EXPIRES})
    res.cookie("refreshToken",refreshToken ,{
       httpOnly: true,   // Isse Client-side JavaScript (jaise document.cookie) aapki cookie ko access nahi kar payegi. Ye XSS (Cross-Site Scripting) attacks se bachane ke liye zaroori hai.
secure: true,     // Isse cookie sirf HTTPS (encrypted connection) ke zariye hi bheji jayegi. Ye "Man-in-the-Middle" attacks aur data interception ko rokta hai.
sameSite: "strict", // Isse browser cookie ko sirf tabhi bhejega jab request usi website se origin ho rahi ho. Ye CSRF (Cross-Site Request Forgery) attacks ko puri tarah block kar deta hai.
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })

    const refreshedHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    const session = new SessionModel({
      user:newUser._id,
      refreshToken:refreshedHash,
      expiresAt: new Date(Date.now() + Number(config.SESSION_EXPIRES_IN_MS)),
      ipAddress:req.ip,

      userAgent:req.get("user-agent")
    })
    await session.save({ session: dbsession });


    const accessToken = jwt.sign({id:newUser._id,sessionId:session._id},config.ACCESS_TOKEN,{expiresIn:config.ACCESS_EXPIRES})
     res.cookie("accessToken",accessToken ,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:15 * 60 * 1000 //15 minutes
    })
   
  await dbsession.commitTransaction();
    return res.status(201).json({message:"user created successfully ", newUser ,accessToken,refreshToken ,session})
  }
  catch(error){
    await dbsession.abortTransaction();
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }finally{
    await dbsession.endSession();
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
    const refreshToken = jwt.sign({id:user._id},config.REFRESH_TOKEN,{expiresIn:config.REFRESH_EXPIRES})
    res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    })
  
 const refreshedHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    
    const session = new SessionModel({
      user:user._id,
      refreshToken:refreshedHash,
      expiresAt: new Date(Date.now() + Number(config.SESSION_EXPIRES_IN_MS)),
      ipAddress:req.ip,
      userAgent:req.get("user-agent")

    })
    await session.save();

    const AcessToken = jwt.sign({id:user._id,sessionId:session._id},config.ACCESS_TOKEN,{expiresIn:config.ACCESS_EXPIRES})
    res.cookie("accessToken",AcessToken,{
      httpOnly:true,
      secure:true,
      sameSite:"strict",
      maxAge:15 * 60 * 1000 //15 minutes
    })
    return res.status(200).json({message:"User logged in successfully",user,AcessToken,refreshToken})

  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }

 
}

/**
 * @description profile user
 * @route Get /api/auth/profile
 * @access Private
 */

export const profileController = async(req, res) => {
  try{
    const token = req.cookies.accessToken;
   
    if(!token){
      return res.status(401).json({message:"Please login again"})
    }
   const decodedToken = jwt.verify(token,config.ACCESS_TOKEN)

   const session = await SessionModel.findOne({
    user:decodedToken.id,
    revoked:false,
    expiresAt:{$gt:new Date()}
   })
   if(!session){
    return res.status(401).json({message:"Session expired or logged out. Please login again."})
   }

   const user = await UserModel.findById(decodedToken.id)
   return res.status(200).json({message:"User profile",user})
  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }
 
}



/**
 * @description refresh token
 * @route Post /api/auth/refresh
 * @access Private
 */


export const refreshTokenController = async (req, res) => {
  try {
    // 1. Browser se purana token lo
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    // 2. JWT Verify karo (Ye sirf signature check karega)
    const decodedToken = jwt.verify(oldRefreshToken, config.REFRESH_TOKEN);

    // 3. Database mein wahi purana token dhoondo (Security Check)
    const oldTokenHash = crypto.createHash("sha256").update(oldRefreshToken).digest("hex");

    const session = await SessionModel.findOne({
      refreshToken: oldTokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() }
    });``

    if (!session) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    // 4. User ko dhoondo
    const user = await UserModel.findById(decodedToken.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 5. Naye tokens banao
    const accessToken = jwt.sign({ id: user._id }, config.ACCESS_TOKEN, { expiresIn: config.ACCESS_EXPIRES });
    const newRefreshToken = jwt.sign({ id: user._id }, config.REFRESH_TOKEN, { expiresIn: config.REFRESH_EXPIRES });

    // 6. DB mein purana hatakar naya wala hash save karo (Rotation)
    const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshToken = newHashedToken;
    await session.save();

    // 7. Cookies set karo
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({ message: "Token refreshed successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Session expired, please login again" });
  }
}



/**
 * @description logout user
 * @route Post /api/auth/logout
 * @access Private
 */


export const logoutController = async(req,res)=>{
  try{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
      return res.status(400).json({message:"refresh token not found"})
    }

    const refreshToeknHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await SessionModel.findOne({refreshToken:refreshToeknHash , revoked:false});
    if(!session){
      return res.status(404).json({message:"Session not found or already revoked"})
    }
    
    session.revoked = true;
    await session.save();
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).json({message:"User logged out successfully"})




  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }

}
  

/**
 * @description logout all device user
 * @route Post /api/auth/logout-all
 * @access Private
*/



export const logoutAllController = async(req,res)=>{

  try{

    const existingRefreshToken = req.cookies.refreshToken;
    if(!existingRefreshToken){
      return res.status(400).json({message:"refresh token not found"})
    }
    const decodedToken = jwt.verify(existingRefreshToken,config.REFRESH_TOKEN)
     await SessionModel.updateMany(
      {user:decodedToken.id},
      {$set:{revoked:true}}
     )

     // 3. Clear Cookies with same options used during login
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Production mein true rakhna
        sameSite: 'strict'
    };
     res.clearCookie("refreshToken",cookieOptions);
     res.clearCookie("accessToken",cookieOptions);
     return res.status(200).json({message:"User logged out successfully"})

  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
  }

}