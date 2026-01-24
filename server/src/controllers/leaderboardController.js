const User = require('../models/User');
const Progress = require('../models/Progress');
const DailyPlan = require('../models/DailyPlan');

const startOfWeek = (d) => {
  const x = new Date(d);
  const day = x.getUTCDay();
  const diff = x.getUTCDate() - day + (day === 0 ? -6 : 1);
  x.setUTCDate(diff);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('name email streakCount lastActiveDate')
      .lean();

    const progressAgg = await Progress.aggregate([
      { $match: { status: 'Done' } },
      { $group: { _id: '$userId', completed: { $sum: 1 } } },
    ]);
    const progressMap = {};
    progressAgg.forEach((p) => (progressMap[p._id.toString()] = p.completed));

    const weekStart = startOfWeek(new Date());
    const weekPlans = await DailyPlan.find({ date: { $gte: weekStart } });
    const weeklyMap = {};
    weekPlans.forEach((p) => {
      const uid = p.userId.toString();
      weeklyMap[uid] = (weeklyMap[uid] || 0) + p.completedTasks.length;
    });

    const leaderboard = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      completed: progressMap[u._id.toString()] || 0,
      streak: u.streakCount || 0,
      weeklyCompleted: weeklyMap[u._id.toString()] || 0,
    }));

    leaderboard.sort((a, b) => {
      if (b.completed !== a.completed) return b.completed - a.completed;
      if (b.streak !== a.streak) return b.streak - a.streak;
      return b.weeklyCompleted - a.weeklyCompleted;
    });

    res.json(leaderboard.slice(0, 100));
  } catch (err) {
    next(err);
  }
};

module.exports = { getLeaderboard };
