import express from 'express';
import { updateUser } from '../Controllers/UserController.js';
import { logInMiddleware,isAdmin } from "../Middleware/authMiddleware.js";

const router = express.Router();
router.put("/update" ,updateUser);


export default router;