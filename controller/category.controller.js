const Category = require('../models/category.model');

exports.createCategory = async (req, res) => {
    const category = new Category({ ...req.body, createdBy: req.user });
    await category.save();
    res.status(201).json({ data: category, messages: 'successes', ok: true });
};

exports.getCategories = async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({ data: categories, messages: 'successes', ok: true });
};

exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ data: category, messages: 'successes', ok: true });
};

exports.deleteCategory = async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
};