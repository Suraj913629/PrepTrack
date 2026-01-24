const Topic = require('../models/Topic');
const Question = require('../models/Question');

const getTopics = async (req, res, next) => {
  try {
    const { sheetId } = req.query;
    const filter = sheetId ? { sheetId } : {};
    const topics = await Topic.find(filter).populate('sheetId', 'name').sort({ createdAt: 1 }).lean();
    res.json(topics);
  } catch (err) {
    next(err);
  }
};

const createTopic = async (req, res, next) => {
  try {
    const topic = await Topic.create(req.body);
    res.status(201).json(topic);
  } catch (err) {
    next(err);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    next(err);
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    await Question.deleteMany({ topicId: topic._id });
    res.json({ message: 'Topic deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTopics, createTopic, updateTopic, deleteTopic };
