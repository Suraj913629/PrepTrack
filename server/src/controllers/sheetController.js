const Sheet = require('../models/Sheet');
const Topic = require('../models/Topic');
const Question = require('../models/Question');

const getSheets = async (req, res, next) => {
  try {
    const sheets = await Sheet.find().sort({ createdAt: -1 }).lean();
    res.json(sheets);
  } catch (err) {
    next(err);
  }
};

const createSheet = async (req, res, next) => {
  try {
    const sheet = await Sheet.create(req.body);
    res.status(201).json(sheet);
  } catch (err) {
    next(err);
  }
};

const updateSheet = async (req, res, next) => {
  try {
    const sheet = await Sheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });
    res.json(sheet);
  } catch (err) {
    next(err);
  }
};

const deleteSheet = async (req, res, next) => {
  try {
    const sheet = await Sheet.findByIdAndDelete(req.params.id);
    if (!sheet) return res.status(404).json({ message: 'Sheet not found' });
    await Topic.deleteMany({ sheetId: sheet._id });
    await Question.deleteMany({ sheetId: sheet._id });
    res.json({ message: 'Sheet deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSheets, createSheet, updateSheet, deleteSheet };
