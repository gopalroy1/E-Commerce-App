import UserModel from "../Models/userModel.js"

///Put user
export const updateUser= async(req,res)=>{
    try {
    const {name,email,address,phone,id} = req.body;

    if(!name || !email || !address || !phone){
        console.log(name,email,address,phone);
        res.status(400).json({
            status: "failed",
            message: "na email na password",
            reqBody:req.body,
          });
        return;
    }
    
   
    const user1 = await UserModel.findByIdAndUpdate(id,{
        name,
        email,
        phone,
        address,
    });
    const user2 = await UserModel.findById(id);

    res.status(200).json({
        status: true,
        message: "User updated sucessfully",
        user:user2,
        reqBody:req.body,
    });
    

    return;
   

    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "Error in updating user",
            Error:error,
            reqBody:req.body,
          });
        return;
      
    }
}