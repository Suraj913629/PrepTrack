const User = require('../models/User');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role streakCount lastActiveDate createdAt').lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers };
