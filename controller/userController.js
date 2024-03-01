const ErrorHander = require('../utils/errorHander');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../model/userModel');

const sendToken = require("../utils/JWTTOKEN");


exports.registerUser = catchAsyncErrors(async (req,res,next) => {
  
    const {name,email,password,phoneNo,priority} = req.body;
    

    
    const user = await User.create({
        name,
        email,
        password,
        phoneNo,
        priority,
    });
    sendToken(user,200,res);
    // Handle the successful upload here
    
})


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    const isCorresctPassword = await user.comparePassword(password);
  
    if (!isCorresctPassword) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    sendToken(user,200,res);
    
})

exports.logout = catchAsyncErrors( async(req,res,next) => {

  res.cookie('token',null,{
    expires : new Date(Date.now()),
    httpOnly : true,
  });

  res.status(200).json({
    success:true,
    message :"Logout Succesfully"
  })
})