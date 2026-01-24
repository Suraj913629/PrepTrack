const PDFDocument = require('pdfkit');
const User = require('../models/User');
const Progress = require('../models/Progress');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const Sheet = require('../models/Sheet');
const DailyPlan = require('../models/DailyPlan');

const startOfDay = (d) => {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
};

const progressPdf = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('name email').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const progress = await Progress.find({ userId: req.user._id }).lean();
    const progressMap = {};
    progress.forEach((p) => {
      progressMap[p.questionId.toString()] = p;
    });

    const questionIds = [...new Set(progress.map((p) => p.questionId))];
    const questions = await Question.find({ _id: { $in: questionIds } })
      .populate('topicId', 'name')
      .lean();

    const topicIds = [...new Set(questions.map((q) => q.topicId?._id).filter(Boolean))];
    const topics = await Topic.find({ _id: { $in: topicIds } }).lean();
    const topicMap = {};
    topics.forEach((t) => (topicMap[t._id.toString()] = t.name));

    const byStatus = { 'Not Started': 0, Done: 0, Revising: 0, Skipped: 0 };
    progress.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });

    const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
    questions.forEach((q) => {
      const p = progressMap[q._id.toString()];
      if (p && p.status === 'Done') byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
    });

    const today = startOfDay(new Date());
    const plan = await DailyPlan.findOne({ userId: req.user._id, date: today });
    const todayCompleted = plan ? plan.completedTasks : [];

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=preptrack-progress-${Date.now()}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('PrepTrack Progress Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`User: ${user.name} (${user.email})`);
    doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Overall Progress', { underline: true });
    doc.fontSize(10);
    doc.text(`Total tracked: ${progress.length}`);
    doc.text(`Not Started: ${byStatus['Not Started'] || 0} | Done: ${byStatus['Done'] || 0} | Revising: ${byStatus['Revising'] || 0} | Skipped: ${byStatus['Skipped'] || 0}`);
    doc.moveDown();

    doc.text('Difficulty-wise (Done):');
    doc.text(`Easy: ${byDifficulty['Easy'] || 0} | Medium: ${byDifficulty['Medium'] || 0} | Hard: ${byDifficulty['Hard'] || 0}`);
    doc.moveDown(2);

    doc.fontSize(14).text('Topic-wise Completion', { underline: true });
    doc.fontSize(10);

    const byTopic = {};
    questions.forEach((q) => {
      const tname = topicMap[q.topicId?._id?.toString()] || 'Unknown';
      if (!byTopic[tname]) byTopic[tname] = { done: 0, total: 0 };
      byTopic[tname].total++;
      const p = progressMap[q._id.toString()];
      if (p && p.status === 'Done') byTopic[tname].done++;
    });

    Object.entries(byTopic).forEach(([tname, v]) => {
      doc.text(`${tname}: ${v.done}/${v.total}`);
    });
    doc.moveDown(2);

    doc.fontSize(14).text("Today's Completed Tasks", { underline: true });
    doc.fontSize(10);
    if (todayCompleted.length === 0) {
      doc.text('None');
    } else {
      const qs = await Question.find({ _id: { $in: todayCompleted } }).populate('topicId', 'name').lean();
      qs.forEach((q) => doc.text(`- ${q.title} (${q.topicId?.name || '-'})`));
    }

    doc.end();
  } catch (err) {
    next(err);
  }
};

module.exports = { progressPdf };
