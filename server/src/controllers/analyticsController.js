const Progress = require('../models/Progress');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const DailyPlan = require('../models/DailyPlan');

const startOfDay = (d) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const progress = await Progress.find({ userId }).lean();
    const progressMap = {};
    progress.forEach((p) => (progressMap[p.questionId.toString()] = p));

    const questions = await Question.find().populate('topicId', 'name').lean();
    const topics = await Topic.find().lean();
    const topicMap = {};
    topics.forEach((t) => (topicMap[t._id.toString()] = t.name));

    const topicWise = {};
    questions.forEach((q) => {
      const tname = topicMap[q.topicId?._id?.toString()] || 'Unknown';
      if (!topicWise[tname]) topicWise[tname] = { done: 0, total: 0 };
      topicWise[tname].total++;
      const p = progressMap[q._id.toString()];
      if (p && p.status === 'Done') topicWise[tname].done++;
    });

    const topicChart = Object.entries(topicWise).map(([name, v]) => ({
      name,
      done: v.done,
      total: v.total,
      percent: v.total > 0 ? Math.round((v.done / v.total) * 100) : 0,
    }));

    const difficultyWise = { Easy: { done: 0, total: 0 }, Medium: { done: 0, total: 0 }, Hard: { done: 0, total: 0 } };
    questions.forEach((q) => {
      const d = q.difficulty || 'Medium';
      difficultyWise[d].total++;
      const p = progressMap[q._id.toString()];
      if (p && p.status === 'Done') difficultyWise[d].done++;
    });

    const difficultyChart = Object.entries(difficultyWise).map(([name, v]) => ({
      name,
      done: v.done,
      total: v.total,
      percent: v.total > 0 ? Math.round((v.done / v.total) * 100) : 0,
    }));

    const weekDays = 7;
    const dailyCompleted = [];
    for (let i = weekDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = startOfDay(d);
      const plans = await DailyPlan.find({ userId, date: dayStart }).lean();
      const count = plans.reduce((acc, p) => acc + (p.completedTasks?.length || 0), 0);
      dailyCompleted.push({
        date: dayStart.toISOString().split('T')[0],
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayStart.getUTCDay()],
        count,
      });
    }

    res.json({
      topicWise: topicChart,
      difficultyWise: difficultyChart,
      weeklyProgress: dailyCompleted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics };
