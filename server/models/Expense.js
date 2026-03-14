import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  
    user:{
        type:mongoose.Schema.Types.ObjectId,  // for mutiple user system
        ref:"User",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    data:{
        type:Date,
        default:Date.now
    }
},
{timestamps:true}
);
 
export default mongoose.model("Expense", expenseSchema);