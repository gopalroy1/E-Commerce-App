import  express  from "express";
import { addCatagory, deleteSingleController, getAllController, getSingleController, updateCatagoryController} from "../Controllers/CatagoryController.js";
import { isAdmin, logInMiddleware } from "../Middleware/authMiddleware.js";

const routerCategory = express.Router();

routerCategory.post("/add",logInMiddleware,isAdmin,addCatagory);
routerCategory.put("/update",logInMiddleware,isAdmin,updateCatagoryController);
routerCategory.get("/getall",getAllController);
routerCategory.get("/singlecategory/:slug",getSingleController);
routerCategory.delete("/delete/:id",logInMiddleware,isAdmin,deleteSingleController);

export default routerCategory;