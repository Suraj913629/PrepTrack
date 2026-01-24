const DailyPlan = require('../models/DailyPlan');
const Progress = require('../models/Progress');
const Question = require('../models/Question');

const startOfDay = (d) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

const generate = async (req, res, next) => {
  try {
    const { questionsPerDay } = req.body;
    const today = startOfDay(new Date());

    const excludeIds = await Progress.find({
      userId: req.user._id,
      status: { $in: ['Done', 'Revising', 'Skipped'] },
    }).distinct('questionId');
    const excludeSet = new Set(excludeIds.map((id) => id.toString()));
    const allQ = await Question.find({}).select('_id').lean();
    const notStartedIds = allQ.filter((q) => !excludeSet.has(q._id.toString())).map((q) => q._id);

    const allQuestions = await Question.find({ _id: { $in: notStartedIds } })
      .sort({ difficulty: 1, createdAt: 1 })
      .limit(questionsPerDay)
      .select('_id')
      .lean();

    const taskIds = allQuestions.map((q) => q._id);

    let plan = await DailyPlan.findOne({ userId: req.user._id, date: today });
    if (plan) {
      plan.tasks = taskIds;
      plan.completedTasks = [];
      await plan.save();
    } else {
      plan = await DailyPlan.create({
        userId: req.user._id,
        date: today,
        tasks: taskIds,
        completedTasks: [],
      });
    }

    const tasks = await Question.find({ _id: { $in: plan.tasks } })
      .populate('topicId', 'name')
      .lean();

    res.json({
      plan: { ...plan.toObject(), tasks },
      completionPercent: 0,
    });
  } catch (err) {
    next(err);
  }
};

const getToday = async (req, res, next) => {
  try {
    const today = startOfDay(new Date());
    let plan = await DailyPlan.findOne({ userId: req.user._id, date: today });
    if (!plan) {
      return res.json({ plan: null, tasks: [], completedTasks: [], completionPercent: 0 });
    }

    const completedSet = new Set(plan.completedTasks.map((id) => id.toString()));
    const remainingIds = plan.tasks.filter((id) => !completedSet.has(id.toString()));
    const tasks = await Question.find({ _id: { $in: remainingIds } })
      .populate('topicId', 'name')
      .lean();
    const completed = await Question.find({ _id: { $in: plan.completedTasks } })
      .populate('topicId', 'name')
      .lean();

    const total = plan.tasks.length;
    const done = plan.completedTasks.length;
    const completionPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    res.json({
      plan,
      tasks,
      completedTasks: completed,
      completionPercent,
    });
  } catch (err) {
    next(err);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const today = startOfDay(new Date());

    let plan = await DailyPlan.findOne({ userId: req.user._id, date: today });
    if (!plan) return res.status(404).json({ message: 'No plan for today' });

    const qId = questionId;
    if (!plan.tasks.some((id) => id.toString() === qId)) {
      return res.status(400).json({ message: 'Question not in today\'s plan' });
    }

    if (!plan.completedTasks.some((id) => id.toString() === qId)) {
      plan.completedTasks.push(qId);
      await plan.save();
    }

    const total = plan.tasks.length;
    const done = plan.completedTasks.length;
    const completionPercent = total > 0 ? Math.round((done / total) * 100) : 0;

    res.json({ plan, completionPercent });
  } catch (err) {
    next(err);
  }
};

module.exports = { generate, getToday, completeTask };
