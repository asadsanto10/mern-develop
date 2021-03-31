const Joi = require('@hapi/joi');

// validate register Schema
const registerValidators = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    phone: Joi.number().min(6).required(),
    password: Joi.string().min(6).required(),
    cPassword: Joi.ref('password'),
  });

  return schema.validate(data);
};

const loginValidators = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

module.exports.registerValidators = registerValidators;
module.exports.loginValidators = loginValidators;
