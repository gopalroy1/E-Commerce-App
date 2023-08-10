import User from "../Models/userModel.js";
import { hashPassword, comparePassword } from "../Helpers/authHelper.js";
import Jwt from "jsonwebtoken";

// for Post, url: ./add
export const registerController = async (req, res) => {
  console.log("function chala");
  //Checking user input details
  let { name, email, password, phone, address, role } = req.body;
  email= email.toLowerCase();
  if (!name || !email || !phone || !address || !password) {
    res.status(400).json({
      status: "failed",
      message: "Please enter valid details",
      body: req.body,
    });
    return;
  }

  //Cheking if unique user is present or not
  let userCheckPhone = await User.findOne({ phone: phone });
  let userCheckEmail = await User.findOne({ email: email });
  if (userCheckPhone) {
    res.status(400).json({
      status: "failed",
      message: "User Phone already exists",
      body: req.body,
      userIs: userCheckPhone,
    });
    return;
  }
  if (userCheckEmail) {
    res.status(400).json({
      status: "failed",
      message: "User email already exists",
      body: req.body,
      userIs: userCheckEmail,
    });
    return;
  }
  const newPass = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    phone,
    address,
    password: newPass,
  });
  console.log(user);
  res.status(201).json({
    status: "Passed",
    message: "User registered sucessfully",
    body: user,
  });
};


        //For Log in
        // POST url: "./login"
export const userLogIn = async (req, res) => {
  let { email, phone, password} = req.body;
  email = email.toLowerCase();
  //Handling errors
  if (!email && !phone) {
    res.status(400).json({
      status: false,
      message: "na email na password",
      body: req.body,
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      status: "failed",
      message: "password hi nahi dia",
      body: req.body,
    });
    return;
  }
  //Log in by email
  if (email) {
    const user1 =await User.findOne({ email});
    if (!user1) {
      res.status(400).json({
        status: "failed",
        message: "user nahi mila",
        body: req.body,
      });
      return;
    }
    const check = await comparePassword(password, user1.password);
    if (!check) {
      res.status(400).json({
        status: "failed",
        message: "password galat",
        email
      });
      return;
    }
    const token = await Jwt.sign(
      { email: user1.email },
      process.env.TOKEN_GENERATE,
      {
        expiresIn: "500m",
      }
    );
    res.status(201).json({
      status: "Passed",
      message: "Token generated sucessfully",
      user:user1,
      token: token,
    });
    return;
  }
  //Log in by phone
  if (phone) {
    const user = await User.findOne({ phone: phone });
    if (!user) {
      res.status(400).json({
        status: "failed",
        message: "user nahi mila on phone",
        body: req.body,
      });
      return;
    }
    const check = await comparePassword(password, user.password);
    if (check !== true) {
      res.status(400).json({
        status: "failed",
        message: "password galat phone se check",
        body: req.body,
      });
      return;
    }
    const token = await Jwt.sign(
      { email: user.email },
      process.env.TOKEN_GENERATE,
      {
        expiresIn: "40m",
      }
    );

    res.status(201).json({
      status: "Passed",
      message: "Token generated sucessfully",
      email: email,
      token: token,
    });
    return;
  }
};


//Protected route by login
export const  test=async(req,res)=>{
  const user = await User.findOne({email:req.body.email});
  console.log(user);
  if(user.role===1){
  res.status(200).json({
    status: "Passed",
    message: "It is validated that you are admin",
    user:req.body,
  });
}
else{
  res.status(200).json({
    status: "Passed",
    message: "You are not admin",
    user:req.body,
  });
}
}
