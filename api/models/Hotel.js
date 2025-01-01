import mongoose from "mongoose";


const HotelSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    type:{//type of property-hotel,hostel,apartment
        type:String,
        required:true
    },
    city:{
        type:String,
        require:true
    },
    distance:{
        type:String,
        require:true
    },
    photos:{
        type:[String],
    },
    rating:{
        type:Number,
        min:0,
        max:5
    },
    rooms:{
        type:[String],
    },
    cheapestPrice:{
        type:Number,
        required:true
    },
    featured:{
        type:Boolean,
        default:false,
    },
});
export default mongoose.model("Hotel",HotelSchema) 