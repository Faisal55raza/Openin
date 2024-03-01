 const express =require('express');
 const bodyparser = require('body-parser');
 const app = express();
 const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const scheduleCronJob = require('./middleware/cronJob')
const errorMiddleware = require('./middleware/error');


const task = require('./routes/taskRoute');
const user = require('./routes/userRoute');
const Subtask = require('./routes/subTaskRoute');



dotenv.config({
    path:"config/config.env"
});

mongoose.connect(process.env.DB_URI).then((data) =>{
console.log(`MongoDB connected with server: ${data.connection.host}`)
   scheduleCronJob();
})
.catch((err) => console.error(err));






app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());

// setPriority();
// call();

 app.use("/openinapp/",user);
 app.use("/openinapp/",task);
 app.use("/openinapp/",Subtask);


 


app.use(errorMiddleware);

app.listen(process.env.PORT,()=>{
    console.log('server is working on http://localhost:'+process.env.PORT);
});
