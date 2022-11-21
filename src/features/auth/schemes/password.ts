import joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = joi.object({
  email: joi.string().required().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email cannot be empty'
  })
});

const passwordSchema: ObjectSchema = joi.object({
  password: joi.string().required().min(6).max(16).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 16 characters long'
  }),
  confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
    'any.only': 'Passwords do not match',
    'string.base': 'Confirm password must be a string',
    'string.empty': 'Confirm password cannot be empty',
    'any.required': 'Confirm password is required'
  })
});

export { emailSchema, passwordSchema };
