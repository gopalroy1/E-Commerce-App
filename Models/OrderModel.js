import mongoose from "mongoose";

const OrderModel = new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:"Products"
    }],
    payment:{},
    buyer:{
        type:mongoose.ObjectId,
        ref:"users"
    },
    status:{
        type:String,
        default:"Not process",
        enum:["Not process","Processing","Shipped","delivered","cancel"]
    }

},{timestamps:true});
export default mongoose.model("OrderModel",OrderModel);