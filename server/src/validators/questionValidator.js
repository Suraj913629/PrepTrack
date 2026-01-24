const Joi = require('joi');

const createQuestionSchema = Joi.object({
  sheetId: Joi.string().hex().length(24).required(),
  topicId: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().min(1).max(500).required(),
  link: Joi.string().max(500).allow(''),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
});

const updateQuestionSchema = Joi.object({
  sheetId: Joi.string().hex().length(24),
  topicId: Joi.string().hex().length(24),
  title: Joi.string().trim().min(1).max(500),
  link: Joi.string().max(500).allow(''),
  difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
});

const validateCreateQuestion = (req, res, next) => {
  const { error } = createQuestionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdateQuestion = (req, res, next) => {
  const { error } = updateQuestionSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validateCreateQuestion, validateUpdateQuestion };
