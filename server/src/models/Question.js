const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    sheetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sheet', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    title: { type: String, required: true, trim: true },
    link: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

questionSchema.index({ sheetId: 1, topicId: 1 });
questionSchema.index({ title: 'text' });

module.exports = mongoose.model('Question', questionSchema);
