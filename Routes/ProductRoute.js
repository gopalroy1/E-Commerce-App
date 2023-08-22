import  express  from "express";
import { addProduct,  deleteProduct, getAllProduct, getAllProductAdmin, getProductPhoto, getSearchProducts, getSingleProduct, productByCategory, updateProduct } from "../Controllers/ProductController.js";
import { isAdmin, logInMiddleware } from "../Middleware/authMiddleware.js";
import ExpressFormidable from "express-formidable";


const router = express.Router();

router.post("/add", logInMiddleware,isAdmin,ExpressFormidable(),addProduct);
router.get("/getall",getAllProduct );
router.get("/getalladmin",getAllProductAdmin );
router.get("/get/:id",getSingleProduct );
router.get("/search/:val",getSearchProducts );
router.get("/get/product-image/:slug",getProductPhoto );
router.delete("/delete/:id",logInMiddleware,isAdmin,deleteProduct );
router.put("/update/:id",ExpressFormidable(),updateProduct );
router.get("/category/:id",productByCategory);

// Route for payments 
//For token
// router.get('/braintree/token',braintreeTokenController)

//Payments 
// router.post('/braintree/payment',logInMiddleware,braintreePaymentController)

export default router;