import mongoose from "mongoose";

const catagoryModel = new mongoose.Schema({
    name:{
        type:String,
        requried:true,
        unique:true,
    },
    slug:{
        type:String,
        lowecase:true,
    },

});
export default mongoose.model("Category",catagoryModel);