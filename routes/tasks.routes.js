const express = require('express');
const asyncHandler = require("../middleware/asynchandler");
const authVerify = require('../middleware/authverify');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require('../controller/task.controller');
const router = express.Router();

router.post('/', authVerify, asyncHandler(createTask));
router.get('/', authVerify, asyncHandler(getTasks));
router.put('/:id', authVerify, asyncHandler(updateTask));
router.delete('/:id', authVerify, asyncHandler(deleteTask));

module.exports = router;