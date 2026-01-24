const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    status: {
      type: String,
      enum: ['Not Started', 'Done', 'Revising', 'Skipped'],
      default: 'Not Started',
    },
    note: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
