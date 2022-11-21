import joi, { ObjectSchema } from 'joi';

const signUpSchema: ObjectSchema = joi.object({
  username: joi.string().required().min(4).max(8).messages({
    'string.base': 'Username must be a string',
    'string.min': 'Username must be at least 4 characters long',
    'string.max': 'Username must be at most 8 characters long',
    'string.empty': 'Username cannot be empty'
  }),
  password: joi.string().required().min(6).max(16).messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 16 characters long',
    'string.empty': 'Password cannot be empty'
  }),
  email: joi.string().required().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'string.empty': 'Email cannot be empty'
  }),
  avatarColor: joi.string().required().messages({
    'string.base': 'Avatar color must be a string',
    'string.empty': 'Avatar color cannot be empty'
  }),
  avatarImage: joi.string().required().messages({
    'string.base': 'Avatar Image must be a string',
    'string.empty': 'Avatar Image cannot be empty'
  })
});

export { signUpSchema };
