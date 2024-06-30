const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['To-Do', 'In Progress', 'Completed'], default: 'To-Do' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


module.exports = mongoose.model('Task', taskSchema);