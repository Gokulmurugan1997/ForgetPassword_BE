import { error } from "console"
import userModel from "../model/user.js"
import Auth from "../utils/auth.js"
import crypto from "crypto"
import nodemailer from "nodemailer"

const getAllUser = async(req,res)=>{
    try {
         let user = await userModel.find({},{password:0})
            res.status(200).send({
                message:"user fetched successfully",
                user
            })
        
        
    } catch (error) {
        res.status(500).send({ 
            message:error.message ||"Internal Server Error"
    })
}
}

const getAllUserByid = async(req,res)=>{
    try {
        let user = await userModel.findOne({_id:req.params.id},{password:0})

        res.status(200).send({
            message:"user fetched succesfully",
            user
        })
    } catch (error) {
        res.status(500).send({ 
            message:error.message ||"Internal Server Error"
    })
}
}
const signup = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
       
        if(!user){
        req.body.password = await Auth.hashPassword(req.body.password)
        await userModel.create(req.body)
        res.status(200).send({ 
            message:"user created successfully"
        })
    }
        else{
            res.status(400).send({
                message:"user already exist"
            })
        }
    } catch (error) {
        res.status(500).send({ 
         message:error.message ||"Internal Server Error"
    })
}
}

const login = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(user){
            if(await Auth.hashCompare(req.body.password, user.password)){
                let token = await Auth.createToken({
                    name:user.name,
                    email:user.email,
                    id:user._id,
                    role:user.role
                })
                res.status(200).send({
                    message:"Login Successful",
                    name:user.name,
                    role:user.role,
                    id:user._id,
                    token
                })
        }

        else{
            res.status(400).send({
                message:"password wrong"
            })
        }
    }
    else{
        res.status(400).send({
            message:"user not found"
        })
    }
    } catch (error) {
        res.status(500).send({ 
            message:error.message ||"Internal Server Error"
    })
}
}
const forgetPassword = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(!user){
            res.status(400).send({
                message:"user not found"
            })
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000;
        await user.save()
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "gokulmuruganp@gmail.com",
          pass: "fihmxelxacffciiq"
        }
      });
      const mailOptions = {
        from: "gokulmuruganp@gmail.com",
        to: user.email,
        subject: 'Password Reset',
        text:`http://localhost:5173/reset-password/${resetToken}`
              
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: 'Error sending email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Reset link sent to your email' });
        }
      });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });  
      console.log(error);
    }
}

 
  const resetPassword = async (req,res) => {
    try {
        let token = req.body.token
        
        if(token){
        let user = await userModel.findOne({resetToken:req.body.token})
       
        if(user){
       user.password = await Auth.hashPassword(req.body.password)
        await user.save()
        res.status(200).send({ 
            message:"user password reset successfully"
        })
    }
        else{
            res.status(400).send({
                message:"user not found"
            })
        }
    }
    else{
        res.status(404).send({
            message:"token not found"
        })
    }
    } catch (error) {
        res.status(500).send({ 
         message:error.message ||"Internal Server Error"
    })
}
}
export default {
    getAllUser,
    getAllUserByid,
    signup,
    login,
    forgetPassword,
    resetPassword
}