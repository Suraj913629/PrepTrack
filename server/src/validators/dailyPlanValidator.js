const Joi = require('joi');

const generatePlanSchema = Joi.object({
  questionsPerDay: Joi.number().integer().min(1).max(50).required(),
});

const validateGeneratePlan = (req, res, next) => {
  const { error } = generatePlanSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validateGeneratePlan };
