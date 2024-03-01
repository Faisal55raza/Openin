const express = require('express');
const { addTask,deleteTask,updateTask,getUserTask } =require('../controller/taskController')
const { isAuthentication }= require('../middleware/authentication')

const router =  express.Router();




router.route("/addTask").post( isAuthentication, addTask);
router.route('/deleteTask/:id').delete( isAuthentication, deleteTask);
router.route('/updateTask/:id').patch( isAuthentication, updateTask);
router.route('/getTask').get(isAuthentication, getUserTask);

module.exports = router;