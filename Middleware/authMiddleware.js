import JWT from "jsonwebtoken";
import userModel from "../Models/userModel.js";




export const logInMiddleware= async(req,res,next)=>{
    try {
        const decode = await JWT.verify(req.headers.authorization,process.env.TOKEN_GENERATE);
        req.user=decode;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json(
            {
                status: "Failed",
                message: "Token is not valid in login middleware",
                newBody:req.body
              }
        )
    }
    
    
}
export const isAdmin= async(req,res,next)=>{
    try {
       
        console.log(req.user.email)
        const email = req.user.email;
        const user =await userModel.findOne({email:email});
       
        if(user.role===1){
            
            next();

        }
        else{
            res.status(400).json(
                {
                    status: "Failed",
                    message: "You are not admin failed in isadmin in auth middleware",
                    body:req.body
                  }
            )
        }
    } catch (error) {
        // console.log(error);
        res.status(400).json(
            {
                status: "Failed",
                message: "Token is not valid in isAdmin in auth middleware",
                body:req.body
              }
        )
    }
    
    
}