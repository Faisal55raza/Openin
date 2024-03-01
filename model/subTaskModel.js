const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
   task:{
    type:mongoose.Schema.ObjectId,
    required:true,
   },
   title:{
    type:String,
    required:true,
   },
   createdAt : {
    type : Date,
    default:Date.now,
   },
   updatedAt : {
    type : Date,
    default:Date.now,
   },
   deletedAt : {
    type : Date,
   },
   status:{
    type:Number,
    default:0,
   },
   isDeleted:{
      type:Boolean,
      default:false,
    }


});

module.exports = mongoose.model("SubTask",subTaskSchema);
