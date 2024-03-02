const mongoose = require('mongoose');
const Task = require('../model/taskModel');


const setPriority = async() => {
    var currentDate = new Date();
    var tasks = await Task.find({isDeleted:false});

    var oneDay = 24 * 60 * 60 * 1000; 

    tasks.forEach(async(item) => {
        
        const firstDate = new Date(item.due_date);
        
      
        const differenceMs = (firstDate.getTime() - currentDate.getTime());
    
        const days = Math.round(differenceMs / oneDay)+1;
    
        
         
        var priority;
        if(days<0&&item.Status != "DONE") {priority = -1}
        else if(days<0&&item.Status == "DONE") {priority = -2}
        else if(days == 0) {priority = 0;}
        else if(days<=2) { priority = 1; }
        else if (days<=4) { priority = 2; }
        else { priority = 3}
       
        item.priority = priority;
        await item.save();
    }
    )
    console.log('All priority of task are set');
}

module.exports = setPriority;
