import  express  from "express";
import { addProduct, deleteProduct, getAllProduct, getProductPhoto, getSingleProduct, updateProduct } from "../Controllers/ProductController.js";
import { isAdmin, logInMiddleware } from "../Middleware/authMiddleware.js";
import ExpressFormidable from "express-formidable";


const router = express.Router();

router.post("/add", logInMiddleware,isAdmin,ExpressFormidable(),addProduct);
router.get("/getall",getAllProduct );
router.get("/get/:slug",getSingleProduct );
router.get("/get/product-image/:slug",getProductPhoto );
router.delete("/delete/:id",logInMiddleware,isAdmin,deleteProduct );
router.put("/update/:id",ExpressFormidable(),updateProduct );

export default router;