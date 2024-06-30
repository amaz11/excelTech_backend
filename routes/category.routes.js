const express = require('express');
const authVerify = require('../middleware/authverify');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require('../controller/category.controller');
const asyncHandler = require('../middleware/asynchandler');
const router = express.Router();

router.post('/', authVerify, asyncHandler(createCategory));
router.get('/', authVerify, asyncHandler(getCategories));
router.put('/:id', authVerify, asyncHandler(updateCategory));
router.delete('/:id', authVerify, asyncHandler(deleteCategory));

module.exports = router;