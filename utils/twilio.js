const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const cron = require('node-cron');
const User = require('../model/userModel'); // Your user model
const Task = require('../model/taskModel');
const app = express();

const accountSid = 'AC3dbed89c3cb2ff6f94fceb2a6f69524e';
const authToken = 'cbd11bcbf5b3c331de99d6cf1eaea0b6';
const client = new twilio(accountSid, authToken);


const twilio_call = async() =>
{

    try {
        const currentDate = new Date();
        
        const users = await Task.aggregate([
            { $match: { priority: -1, isDeleted: false } },
            { $group: { _id: "$user" } },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $sort: { "user.priority": 1 } }
        ]);

        
    await initiateCalls(0);

    async function initiateCalls(index) {
        if (index < users.length) {
            const user = (users[index].user);
        
            try {
              
                const call = await client.calls.create({
                    url: 'http://twimlets.com/message?Message%5B0%5D=Reminder!%20You%20have%20a%20due%20task%20in%20openinapp',
                    to: user.phoneNo,
                    from: '+17817468158'
                });
    
                console.log(`Calling ${user.phoneNo}...`);
    
                
                const callStatus = await monitorCallStatus(call.sid);
    
                console.log(`Call to ${user.phoneNo} completed with status: ${callStatus}`);
    
                
                initiateCalls(index + 1);
            } catch (error) {
                console.error(`Error calling ${user.phoneNo}:`, error);
             
                initiateCalls(index + 1);
            }
        } else {
            console.log('All calls completed.');
        }
    }
    
    
    async function monitorCallStatus(callSid){
        return new Promise((resolve, reject) => {
            let intervalId;
            
            intervalId = setInterval(async () => {
                try {
                    const call = await client.calls(callSid).fetch();
                    if (call.status === 'completed' || call.status === 'failed' || call.status === 'busy'|| call.status === 'no-answer'|| call.status === 'canceled') {
                      
                        clearInterval(intervalId);
                        resolve(call.status);
                    }
                } catch (error) {
                    clearInterval(intervalId);
                    reject(error);
                }
            }, 1000); 
        });
    }
    
    
 } catch (error) {
        console.error('Error scheduling calls:', error);
    }
}
module.exports = twilio_call;
