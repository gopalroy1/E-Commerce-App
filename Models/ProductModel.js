import mongoose from "mongoose";

const ProductModel = new mongoose.Schema({
    name:{
        type:String,
        requried:true
    },
    slug:{
        type:String,
        requried:true,
    },
    description:{
        type:String,
        requried:true,
    },
    price:{
        type:Number,
        requried:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category', 
        requried:true
    },
    quantity:{
        type:Number,
        requried:true,
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,

    }



},{
    timestamps:true
});

export default mongoose.model("Products",ProductModel);