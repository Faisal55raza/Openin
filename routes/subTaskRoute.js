const express = require('express');
const { addSubTask,deleteSubTask, getSubTasks, updateSubTask} =require('../controller/subTaskController')
const { isAuthentication }= require('../middleware/authentication')

const router =  express.Router();




router.route("/addSubTask/:id").post( isAuthentication, addSubTask);
router.route('/deleteSubTask/:id').delete( isAuthentication, deleteSubTask);
router.route('/updateSubTask/:id').patch( isAuthentication, updateSubTask);
router.route('/getSubTask').get(isAuthentication, getSubTasks);

module.exports = router;