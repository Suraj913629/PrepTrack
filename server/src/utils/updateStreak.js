const User = require('../models/User');

const startOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const isYesterday = (date1, date2) => {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  const diff = (d1 - d2) / (24 * 60 * 60 * 1000);
  return diff === 1;
};

const isToday = (date) => {
  const today = startOfDay(new Date());
  const d = startOfDay(date);
  return d.getTime() === today.getTime();
};

const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = startOfDay(new Date());
  const lastActive = user.lastActiveDate ? startOfDay(user.lastActiveDate) : null;

  if (isToday(user.lastActiveDate)) {
    return;
  }

  let newStreak = user.streakCount || 0;

  if (!lastActive) {
    newStreak = 1;
  } else {
    const diffDays = Math.floor((today - lastActive) / (24 * 60 * 60 * 1000));
    if (diffDays === 1) {
      newStreak = (user.streakCount || 0) + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  await User.findByIdAndUpdate(userId, {
    lastActiveDate: new Date(),
    streakCount: newStreak,
  });
};

module.exports = { updateUserStreak, startOfDay, isToday };
