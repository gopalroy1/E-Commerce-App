import fs from 'fs';
import ProductModel from '../Models/ProductModel.js';
import slugify from 'slugify';
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
        const product = await ProductModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1});
        res.status(200).json({
            status:true,
            message:"All product fetched sucessfully",
            productLength:product.length,
            product,
            
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
            ]
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
        const product = await ProductModel.findOne({slug}).populate("category").select("-photo");
        res.status(200).json({
            status:true,
            message:"The product fetched sucessfully",
            product,
            
        })
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in getting a product : error is "+error})
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
        const products = await ProductModel.findByIdAndUpdate(req.params.id,{
            ...req.fields,
            slug:slugify(name),

        },{new:true});
        //Validating the photo
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
    
        }
        await products.save();
        res.status(201).json({status:true,message:"Product updated sucessfully",products})
    
    
    } catch (error) {
        res.status(500).json({status:false,message:"Error in updating product : error is "+error,reqBody:req.fields})
    }

}