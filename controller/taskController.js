const ErrorHander = require('../utils/errorHander');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Task = require('../model/taskModel');
const ApiFeatures = require('../utils/apifeatures');
const SubTask = require('../model/subTaskModel');

exports.addTask = catchAsyncErrors(async(req,res,next) => {

    const { title, description, due_date} = req.body;

    const oneDay = 24 * 60 * 60 * 1000; 
    const firstDate = new Date(due_date);
    const secondDate = new Date();
  
    const differenceMs = (firstDate.getTime() - secondDate.getTime());

    const days = Math.round(differenceMs / oneDay)+1;

    if(days<0){ return next(new ErrorHander("Enter Due Date greater than current",400))}

    let priority;
    
    if(days == 0) {priority = 0;}
    else if(days<=2) { priority = 1; }
    else if (days<=4) { priority = 2; }
    else { priority = 3}
  

    

    const user= req.user.id;
    
    const task = await Task.create({
        user,
        title,
        description,
        due_date, 
        priority
    })
    res.status(201).json({
       success:true,
       task,
    })

});

exports.getUserTask = catchAsyncErrors( async(req,res,next) => {
    const resultPerPage = 2;
    var currentDate = new Date();
    const apiFeature = new ApiFeatures(Task.find({user:req.user.id, isDeleted:false, priority:{$gte : 0}}).sort({priority:1}), req.query).filter();
     
    apiFeature.pagination(resultPerPage);

    var task = await apiFeature.query;

   res.status(200).json({
    success: true,
    task,
    resultPerPage,
 
  });

  });


exports.updateTask = catchAsyncErrors(async(req,res,next) => {

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      const oneDay = 24 * 60 * 60 * 1000; 
      const firstDate = new Date(task.due_date);
      const secondDate = new Date();
    
      const differenceMs = (firstDate.getTime() - secondDate.getTime());
  
      const days = Math.round(differenceMs / oneDay)+1;
  
      if(days<0){ return next(new ErrorHander("Enter Due Date greater than current",400))}
  
      let priority;
      
      if(days == 0) {priority = 0;}
      else if(days<=2) { priority = 1; }
      else if (days<=4) { priority = 2; }
      else { priority = 3}

      task.priority =priority;
     await task.save();
   
    res.status(201).json({
       success:true,
       task
    })

})

exports.deleteTask = catchAsyncErrors(async(req,res,next) => {

    let task= await Task.findById(req.params.id);
   
    task.isDeleted=true;

    await task.save();
    
    res.status(201).json({
       success:true,
      
    })

});
