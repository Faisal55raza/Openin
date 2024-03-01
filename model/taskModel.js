const mongoose =  require("mongoose");

const taskSchema = new mongoose.Schema({
    user:{
      type:mongoose.Schema.ObjectId,
      requires:true,
      ref:"User"
    },
    title:{
      type:String,
      required:true
    },
    description:{
      type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    due_date:{
        type:Date,
        required:true
    },
    Status:{
      type:String,
      default:"TODO",
    },
    isDeleted:{
      type:Boolean,
      default:false,
    },
    priority:{
      type:Number,
      required:true
    }
})



module.exports = mongoose.model("Task", taskSchema);