const Joi = require('joi');

const updateProgressSchema = Joi.object({
  status: Joi.string().valid('Not Started', 'Done', 'Revising', 'Skipped'),
  note: Joi.string().max(5000).allow(''),
});

const validateUpdateProgress = (req, res, next) => {
  const { error } = updateProgressSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validateUpdateProgress };
