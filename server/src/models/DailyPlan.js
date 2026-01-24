const mongoose = require('mongoose');

const dailyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

dailyPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyPlan', dailyPlanSchema);
