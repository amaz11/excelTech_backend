const Task = require('../models/task.model');
const { io, getSokectId } = require('../index')

exports.createTask = async (req, res) => {
    const task = new Task({
        ...req.body,
        createdBy: req.user
    });
    await task.save();

    // Notify assigned user
    const assignedTOSocketID = getSokectId(task.assignedTo)
    io.to(assignedTOSocketID).emit('notification', { type: 'taskCreated', task });
    res.status(201).json({ data: task, messages: 'successes', ok: true });
};

exports.getTasks = async (req, res) => {
    const { keyword, dueDate, priority, category } = req.query;
    const filters = { createdBy: req.user };

    if (keyword) {
        filters.title = { $regex: keyword, $options: 'i' };
    }
    if (dueDate) {
        filters.dueDate = { $lte: new Date(dueDate) };
    }
    if (priority) {
        filters.priority = priority;
    }
    if (category) {
        filters.category = category;
    }
    const page = Number(req.query.page) || 1;
    const limits = Number(req.query.limits) || 1;
    const skip = (page - 1) * limits;
    const tasks = await Task.find(filters).populate('category assignedTo').limit(limits).skip(skip);
    const tasksTotal = await Task.find(filters)
    res.status(200).json({ data: tasks, messages: 'successes', ok: true, total: tasksTotal.length, limit: limits, skip: skip, currentPage: page });
};

exports.updateTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Notify task creator and other assigned user
    const usersToNotify = [task.createdBy.toString(), task.assignedTo.toString()];
    usersToNotify.forEach((userId) => {
        io.to(userId).emit('notification', { type: 'taskUpdated', task });
    });
    const assignedTOSocketID = getSokectId(task.assignedTo)
    const userSocekId = getSokectId(req.user)

    if (task.createdBy.equals(req.user)) {
        // Notify assigned user
        io.to(assignedTOSocketID).emit('notification', { type: 'taskCreated', task });
    } else {
        io.to(userSocekId).emit('notification', { type: 'taskCreated', task });
    }

    res.status(200).json({ data: task, messages: 'successes', ok: true });
};

exports.deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.createdBy.equals(req.user)) {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted', ok: true });
    }
    res.status(401).json({ message: 'Sorry, not authorize to delete this task', ok: false });
};