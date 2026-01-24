const Question = require('../models/Question');

const getQuestions = async (req, res, next) => {
  try {
    const { topicId, sheetId, difficulty, search } = req.query;
    const filter = {};
    if (topicId) filter.topicId = topicId;
    if (sheetId) filter.sheetId = sheetId;
    if (difficulty) filter.difficulty = difficulty;
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
      ];
    }
    const questions = await Question.find(filter)
      .populate('topicId', 'name')
      .sort({ createdAt: 1 })
      .lean();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};

const createQuestion = async (req, res, next) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    next(err);
  }
};

const createBulk = async (req, res, next) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'questions array is required' });
    }
    const inserted = await Question.insertMany(questions);
    res.status(201).json({ count: inserted.length, questions: inserted });
  } catch (err) {
    next(err);
  }
};

const updateQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json(q);
  } catch (err) {
    next(err);
  }
};

const deleteQuestion = async (req, res, next) => {
  try {
    const q = await Question.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuestions, createQuestion, createBulk, updateQuestion, deleteQuestion };
