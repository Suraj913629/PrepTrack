const Joi = require('joi');

const createTopicSchema = Joi.object({
  sheetId: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().min(1).max(200).required(),
});

const updateTopicSchema = Joi.object({
  sheetId: Joi.string().hex().length(24),
  name: Joi.string().trim().min(1).max(200),
});

const validateCreateTopic = (req, res, next) => {
  const { error } = createTopicSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdateTopic = (req, res, next) => {
  const { error } = updateTopicSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validateCreateTopic, validateUpdateTopic };
