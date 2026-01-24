const Progress = require('../models/Progress');
const Question = require('../models/Question');
const { updateUserStreak } = require('../utils/updateStreak');

const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.user._id }).lean();
    const map = {};
    progress.forEach((p) => {
      map[p.questionId.toString()] = { status: p.status, note: p.note, updatedAt: p.updatedAt };
    });
    res.json(map);
  } catch (err) {
    next(err);
  }
};

const updateProgress = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { status, note } = req.body;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    let prog = await Progress.findOne({ userId: req.user._id, questionId });
    if (!prog) {
      prog = await Progress.create({
        userId: req.user._id,
        questionId,
        status: status || 'Not Started',
        note: note !== undefined ? note : '',
      });
    } else {
      if (status !== undefined) prog.status = status;
      if (note !== undefined) prog.note = note;
      prog.updatedAt = new Date();
      await prog.save();
    }

    await updateUserStreak(req.user._id);
    res.json(prog);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, updateProgress };
