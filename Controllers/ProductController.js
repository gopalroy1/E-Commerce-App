import fs from 'fs';
import ProductModel from '../Models/ProductModel.js';
import slugify from 'slugify';
import braintree from 'braintree';
import OrderModel from '../Models/OrderModel.js';
import dotenv from 'dotenv';
dotenv.config();
// Payment gateway braintree 
// var gateway = new braintree.BraintreeGateway({
//     enviroment: braintree.Environment.Sandbox,
//     merchantId: process.env.BRAINTREE_MERCHANT_ID,
//     publicKey: process.env.BRAINTREE_PUBLIC_kEY,
//     privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// })




//POST
//url: /add
//req.body- from data coming
export const addProduct=async(req,res)=>{

    try {
        const{name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
    
       
    
        switch(true){
            case !name:
                return res.status(400).json({status: false,message: "Product name does not exists",ReqParamFields: req.fields});
            case !description:
                return res.status(400).json({status: false,message: "Product description does not exists",ReqParamFields: req.fields});
            case !price:
                return res.status(400).json({status: false,message: "Product price does not exists",ReqParamFields: req.fields});
            case !category:
                return res.status(400).json({status: false,message: "Product catagory does not exists",ReqParamFields: req.fields});
            case !quantity:
                return res.status(400).json({status: false,message: "Product quantity does not exists",ReqParamFields: req.fields});
            case (!photo ):
                return res.status(400).json({status: false,message: "Product photo does not exists ok size is large",ReqParamFields: req.fields});
        }
        //Creating product object 
        const products = new ProductModel({...req.fields,slug:slugify(name)});
        //Validating the photo
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
    
        }
        await products.save();
        res.status(201).json({status:true,message:"Product created sucessfully",products})
    
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in creating product : error is "+error,reqBody:req.fields})
    }

}



//Get
//url: /getall
//no data coming
export const getAllProduct=async(req,res)=>{
    try {
        const product = await ProductModel.find({"shipping":true}).select("-photo").populate("category").sort({createdAt:-1});
        res.status(200).json({
            status:true,
            message:"All product fetched sucessfully",
            productLength:product.length,
            productList:product,
        })
    } catch (error) {
        res.status(500).json({status:false,message:"Error in getting product : error is "+error})
    }
}
//Get
//url: /getall
//no data coming
//all products for admin where it does not depends on shipping value
export const getAllProductAdmin=async(req,res)=>{
    try {
        const product = await ProductModel.find().select("-photo").populate("category").sort({createdAt:-1});
        res.status(200).json({
            status:true,
            message:"All product fetched sucessfully",
            productLength:product.length,
            productList:product,
        })
    } catch (error) {
        res.status(500).json({status:false,message:"Error in getting product : error is "+error})
    }
}



//Get
//url: /val
//search val data coming in req params
export const getSearchProducts=async(req,res)=>{

    try {
        const {val} = req.params
        //Use kr rhe hai or operator 
        //Regex se search kr rhe hai 
        //options i mtlan case insensitive
        //Select to unselect photos
        const productList = await ProductModel.find({
            $or: [
                {name:{ $regex :val, $options:"i"}},
                {description:{ $regex :val, $options:"i"}}
            ],
            "shipping":true,
        }).select("-photo");
        res.status(200).json({
            status:true,
            message:"All product fetched sucessfully",
            productLength:productList.length,
            productList,
            
        })
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in searching products : error is ",errorIs:error})
    }

}


//Get
//url: /get/id
//param product id coming
export const getSingleProduct=async(req,res)=>{

    try {
        const {id}= req.params;
        const product = await ProductModel.findById(id).populate("category").select("-photo");
        // const product = await ProductModel.findOne().populate("category").select("-photo");
        res.status(200).json({
            status:true,
            message:"The product fetched sucessfully",
            product,
            
        })
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in getting a product : error is ",error})
    }

}

//Get product by category
export const productByCategory= async(req,res)=>{
    try {
    const {id} = req.params;
    let pro = await ProductModel.find({}).select("-photo").populate("category");
   const newPro = pro.filter((element)=>{
    if(element.category._id.valueOf()===id){
        return element;
    }
   })
    res.status(200).send({
        status:true,
        productLength:newPro.length,
        productList:newPro
    })
    } catch (error) {
        console.log("Error while fetching products by category: ",error);
        res.status(500).send({
            status:false,
            error:error,
            message:"Error in the api of getting products of category"
        })
    }
    

}


//Get
//url: /product/"slug"
//product slug coming
export const getProductPhoto=async(req,res)=>{

    try {
        const {slug}= req.params;
        const product = await ProductModel.findOne({slug}).select("photo");
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType);
            return res.status(200).send(
                product.photo.data);

        }
        else{

            res.status(400).json({
                status:true,
                message:"The product is not fetched sucessfully sucessfully",
                product,
                
            })
        }
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in getting product photo : error is "+error})
    }

}
//Delete
//url: /delete/:id
//params pid
export const deleteProduct=async(req,res)=>{

    try {
        const {id}= req.params;
        const product = await ProductModel.findByIdAndDelete(id).select("-photo");
        res.status(200).json({
            status:true,
            message:"The product deleted sucessfully",
            product,
            
        })
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in deleting the product : error is "+error})
    }

}


//Update
//url: /update/:id
//Params coming id
export const updateProduct=async(req,res)=>{

    try {
        const{name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;
        const id = req.params.id;
        switch(true){
            case !name:
                return res.status(400).json({status: false,message: "Product name does not exists",ReqParamFields: req.fields});
            case !description:
                return res.status(400).json({status: false,message: "Product description does not exists",ReqParamFields: req.fields});
            case !price:
                return res.status(400).json({status: false,message: "Product price does not exists",ReqParamFields: req.fields});
            case !category:
                return res.status(400).json({status: false,message: "Product catagory does not exists",ReqParamFields: req.fields});
            case !quantity:
                return res.status(400).json({status: false,message: "Product quantity does not exists",ReqParamFields: req.fields});
            
        }
        
        const filter = {_id:id}
        let updatedDoc={};
        if(photo){
            updatedDoc ={
                $set:{
                    name:name,
                    description:description,
                    price:price,
                    quantity:quantity,
                    category:category,
                    shipping:shipping,
                    slug:slugify(name),
                    photo:{
                        data:fs.readFileSync(photo.path),
                        contentType:photo.type,
                    }
                }
            }
        }
        else{
            updatedDoc ={
                $set:{
                    name:name,
                    description:description,
                    price:price,
                    quantity:quantity,
                    category:category,
                    shipping:shipping,
                    slug:slugify(name),
                    
                }
            }
        }
        
        const products = await ProductModel.updateOne(filter,updatedDoc);
        const p = await ProductModel.findById(id);
        res.status(201).json({status:true,message:"Product updated sucessfully",products:p})
    
    
    } catch (err) {
        res.status(500).json({status:false,message:"Error in updating product : error is ",error:err,reqBody:req.fields})
    }

}

// Payment Gateway api 
//For token
// export const braintreeTokenController= async(req,res)=>{
//     try {
//         gateway.clientToken.generate({},function(err,response){
//             if(err){
//                 res.status(500).send(err);
//             }
//             else{
//                 res.send(response)
//             }
//         })
        
//     } catch (error) {
//         console.log("Error in making token for payment is : ",error)
//     }
    
// }
//For payment
// export const braintreePaymentController= async(req,res)=>{
//     try {
//         // getting cart and nonce for req body 
//         const {cart,nonce}= req.body;
//         //Calculating the total price
//         let total =0;
//         cart.map((element)=>{
//             total+=element.price;
//         });
//         let newTransaction = gateway.transaction.sale({
//             amount:total,
//             paymentMethodNonce:nonce,
//             options:{
//                 submitForSettlement:true
//             },
//         },
//         function(error,result){
//             if(result){
//                 const order = new OrderModel({
//                     products:cart,
//                     payment:result,
//                     buyer:req.user._id
//                 }).save()
//                 res.json({status:true})
//             }
//             else{
//                 res.status(500).send(error);
//             }
//         }
//         )
        
//     } catch (error) {
//         console.log("Error while making the payment and the error is : ",error)
//     }
// };

