import CatagoryModel from "../Models/CatagoryModel.js";
import slugify from "slugify";

//Post 
//add catagory 
// Name coming from req.body
export const addCatagory= async(req,res)=>{
  try {

    // console.log(req.body);
    // console.log(res.body);
    const {catagoryname} = req.body;
    // console.log(catagoryname);
    if(!catagoryname){
        res.status(400).json({
            status: false,
            message: "Please enter catagory name ",
            newB: req.body,
            newBR: res.body,
          });
          return;

    }
    const catagory = await CatagoryModel.findOne({name:catagoryname});
    if(catagory){
        res.status(400).json({
            status: false,
            message: "Catagory already exists",
            body: req.body,
          });
          return;
    }
    const newCatagory= await CatagoryModel.create({
        name:catagoryname,
        slug:slugify(catagoryname)

    })
    res.status(201).json({
        status: true,
        message: "catagory created sucessfully",
        body: newCatagory,
      });
      return;
  } catch (error) {
    res.status(404).json({
        status: false,
        message: "Some error happend in try block of catagory adding",
        body: req.body,
      });
  }
}


//Put 
//url: "/update"
//req body - id,newname
export const updateCatagoryController=async(req,res)=>{
   try {
    const {id,newname}= req.body;
    if(!id || !newname){
      res.status(404).json({
        status: false,
        message: "Enter catagory name please",
        body: req.body,
      });
      return;
    }
    const catagory = await CatagoryModel.findById(id);
    if(!catagory){
      res.status(404).json({
        status: false,
        message: "Catagory does not exists",
        reqBody: req.body,
      });
      return;
    }
    const update = await CatagoryModel.findByIdAndUpdate(catagory.id,{name:newname,slug:slugify(newname)},{new:true});
    res.status(200).json({
      status: true,
      message: "Catagory updated",
      catagory:update,
      reqBody: req.body,
    });
    return;
    
   } catch (error) {
    res.status(404).json({
      status: false,
      message: "Error in updating catagory",
      reqBody: req.body,
    });
   }
    
    
}

//Get 
//url: "getall"
//no value coming
export const getAllController= async(req,res)=>{
  try {
    const allCatagory = await CatagoryModel.find();
    res.status(201).json({
      status: true,
      message: "catagory Fetched sucessfully",
      categories:allCatagory,
      
    });
    return;
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error+"Some error happend in fetching all catagories",
      
    });
  }
}
//Get 
//url: "singlecatagory"
//param : slug:"slugname"
export const getSingleController= async(req,res)=>{
  try {
    const {slug} = req.params;
    const catagory = await CatagoryModel.findOne(slug);
    res.status(201).json({
      status: true,
      message: "catagory Fetched sucessfully",
      catagories:catagory,
      
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error+"Some error happend in fetching catagories",
      
    });
  }
}
//Get 
//url: "delete/id"
//param: id:id
export const deleteSingleController= async(req,res)=>{
  try {
    const {id} = req.params;
    if(!id){
      res.status(400).json({
        status: false,
        message: "Give proper catagory id",
        ReqParam: req.params,
      });
      return;
    }
    const catagory = await CatagoryModel.findById(id);
    if(!catagory){
      res.status(400).json({
        status: false,
        message: "Catagory does not exists",
        ReqParam: req.params,
      });
      return;
    }
    const deletedCatagory= await CatagoryModel.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "catagory deleted sucessfully",
      catagory: deletedCatagory,
      ReqParam: req.params,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error+"Some error happend in deleting catagories",
      reqParam:req.params,
    });
  }
}


