// scheduler.js

const schedule = require('node-schedule');
const Task = require('../models/task.model');
const { io, getSokectId } = require('../index'); // Import the io instance

const notifyApproachingDueDates = async () => {
    try {
        const tasks = await Task.find({
            dueDate: { $lte: new Date(Date.now() + 24 * 60 * 60 * 1000) }, // next 24 hours
            status: { $ne: 'Completed' },
        });

        tasks.forEach((task) => {
            const usersToNotify = [task.createdBy.toString(), task.assignedTo.toString()];
            usersToNotify.forEach((userId) => {
                getSokectId(userId)
                io.to(userId).emit('notification', { type: 'dueDateApproaching', task });
            });
        });
    } catch (error) {
        console.error('Error notifying due dates:', error.message);
    }
};

// Schedule the task to run every hour
schedule.scheduleJob('0 * * * *', notifyApproachingDueDates);

module.exports = notifyApproachingDueDates;