import express from "express";

import {
  registerController,
  userLogIn,
  test
} from "../Controllers/authController.js";
import { logInMiddleware,isAdmin } from "../Middleware/authMiddleware.js";
//Routing object
const router = express.Router();

//routing
//POST
router.post("/add", registerController);
router.post("/login", userLogIn);

//Protected routes
router.get("/isadmin",logInMiddleware,test)
router.get("/auth",logInMiddleware,(req,res)=>{
  res.status(200).send({ok:true});
})
//Pass header and admin to pass
router.get("/admin",logInMiddleware,isAdmin,(req,res)=>{
  res.status(200).send({ok:true,
  r:req.body,
re:res.body});
})

export default router;
