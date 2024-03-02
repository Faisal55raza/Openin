
const cron = require('node-cron');
const setPriority = require('../utils/taskPriority');
const twilio_call = require('../utils/twilio')

const scheduleCronJob = async() => {
    await cron.schedule('0 0 * * *', async () => {
        console.log('Running setPriority...');
        await setPriority();
        console.log('Running  twilio calling...');
        await twilio_call();
    }, {
        timezone: 'Asia/Kolkata' 
    });
};

module.exports = scheduleCronJob;
