const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    sheetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sheet', required: true },
    name: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

topicSchema.index({ sheetId: 1 });

module.exports = mongoose.model('Topic', topicSchema);
