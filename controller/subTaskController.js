const ErrorHander = require('../utils/errorHander');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../model/userModel');
const SubTask = require('../model/subTaskModel');
const Task = require('../model/taskModel');
const ApiFeatures = require('../utils/apifeatures');

exports.addSubTask = catchAsyncErrors(async(req,res,next) => {

    const { title } = req.body;
    const subtask = await SubTask.create({
        title,
        createdAt:new Date(),
        task:req.params.id,
    })

    var task = await Task.findById(req.params.id);

    var TaskSub = await SubTask.find({task:task.id,isDeleted:false});
  
    TaskSub.filter(item => item.isDeleted == true);
    
    var ans = "TODO";
    var flag = true;
    TaskSub.map((item) => {
        if(item.status==0){ flag = false; }

        else{ ans="IN_PROGRESS"; }

    });
    if(flag == true){ ans="DONE" }

    task.Status = ans;

    await task.save();

    res.status(201).json({
        success:true,
        subtask
    })
})

exports.updateSubTask = catchAsyncErrors(async(req,res,next) => {
    
    
    var subtask = await SubTask.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      
    var task = await Task.findById(subtask.task);
    
    var TaskSub = await SubTask.find({task:task.id,isDeleted:false});
  
    TaskSub.filter(item => item.isDeleted == true);
    
    var ans = "TODO";
    var flag = true;
    TaskSub.map((item) => {
        if(item.status==0){ flag = false; }

        else{ ans="IN_PROGRESS"; }

    });
    if(flag == true){ ans="DONE" }

    task.Status = ans;

    await task.save();
    
   subtask.updatedAt= new Date();

    await subtask.save();

    res.status(201).json({
       success:true,
      subtask
    })
});

exports.getSubTasks = catchAsyncErrors(async(req,res,next) => {

    const apiFeature = new ApiFeatures(SubTask.find({isDeleted:false}), req.query)
    .filter();
  
    var subTasks = await apiFeature.query;

    res.status(201).json({
        success:true,
        subTasks
     })
})

exports.deleteSubTask = catchAsyncErrors(async(req,res,next) => {

    var subtask = await SubTask.findById(req.params.id);
    
    subtask.isDeleted=true;

    subtask.deletedAt = new Date();

    await subtask.save();

    var task = await Task.findById(subtask.task);

    var TaskSub = await SubTask.find({task : task.id , isDeleted :false});
    
    var ans = "TODO";
    var flag = true;

    TaskSub.map((item) => {
        if(item.status==0){ flag = false; }
        else{ ans="IN_PROGRESS"; }
    });

    if(flag == true){ ans="DONE" }

    task.Status = ans;

    await task.save();

    res.status(201).json({
       success:true,
       subtask
    })

});