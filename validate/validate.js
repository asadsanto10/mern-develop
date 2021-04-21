const Joi = require('@hapi/joi');

// validate register Schema
const registerValidators = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(10).required().messages({
      'string.base': `name field should be a type of 'text'`,
      'string.min': 'name length must be at least 5 characters long',
      'string.max': 'name length must be less than or equal to 10 characters long',
      'string.empty': 'Name cannot be an empty field',
      'any.required': `"Name" is a required.`,
    }),
    email: Joi.string().required().email().messages({
      'string.base': `email field should be a type of 'text'`,
      'string.email': 'email is not valid',
      'string.empty': 'email cannot be an empty field',
      'any.required': `"email" is a required.`,
    }),
    phone: Joi.number().min(6).required().messages({
      'number.base': `phone field should be a type of number`,
      'number.min': 'phon length must be at least 5 characters long',
      'number.empty': 'phone cannot be an empty field',
      'any.required': 'phone is a required.',
    }),
    password: Joi.string().min(6).required().label('Password').messages({
      'string.min': 'password length must be at least 6 characters long',
      'string.empty': 'password cannot be an empty field',
      'any.required': `"password" is a required.`,
    }),
    cPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': 'password does not match' }),
  });

  return schema.validate(data);
};

const loginValidators = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email().messages({
      'string.base': `email field should be a type of 'text'`,
      'string.email': 'email is not valid',
      'string.empty': 'email cannot be an empty field',
      'any.required': 'email is a required.',
    }),
    password: Joi.string().min(6).required().label('Password').messages({
      'string.min': 'password length must be at least 6 characters long',
      'string.empty': 'password cannot be an empty field',
      'any.required': `"password" is a required.`,
    }),
  });

  return schema.validate(data);
};

module.exports.registerValidators = registerValidators;
module.exports.loginValidators = loginValidators;
