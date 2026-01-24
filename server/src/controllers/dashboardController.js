const Progress = require('../models/Progress');
const Question = require('../models/Question');
const User = require('../models/User');
const DailyPlan = require('../models/DailyPlan');

const startOfDay = (d) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totalQuestions = await Question.countDocuments();
    const progress = await Progress.find({ userId }).lean();

    const completed = progress.filter((p) => p.status === 'Done').length;
    const revising = progress.filter((p) => p.status === 'Revising').length;
    const skipped = progress.filter((p) => p.status === 'Skipped').length;
    const notStarted = progress.filter((p) => p.status === 'Not Started').length;

    const user = await User.findById(userId).select('streakCount lastActiveDate').lean();

    const today = startOfDay(new Date());
    const plan = await DailyPlan.findOne({ userId, date: today });
    let todayTotal = 0;
    let todayDone = 0;
    if (plan) {
      todayTotal = plan.tasks.length;
      todayDone = plan.completedTasks.length;
    }

    res.json({
      totalQuestions,
      completed,
      revising,
      skipped,
      notStarted,
      streakCount: user?.streakCount || 0,
      lastActiveDate: user?.lastActiveDate || null,
      todayTotal,
      todayDone,
      todayPercent: todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
