const Joi = require('joi');

const createSheetSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).allow(''),
});

const updateSheetSchema = Joi.object({
  name: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(1000).allow(''),
});

const validateCreateSheet = (req, res, next) => {
  const { error } = createSheetSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateUpdateSheet = (req, res, next) => {
  const { error } = updateSheetSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { validateCreateSheet, validateUpdateSheet };
