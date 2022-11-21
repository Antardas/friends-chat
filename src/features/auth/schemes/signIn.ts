import joi, { ObjectSchema } from 'joi';

const signInSchema: ObjectSchema = joi.object({
  username: joi.string().required().min(4).max(8).messages({
    'string.base': 'Username must be a string',
    'string.min': 'Username must be at least 4 characters long',
    'string.max': 'Username must be at most 8 characters long',
    'string.empty': 'Username cannot be empty'
  }),
  password: joi.string().required().min(6).max(16).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password cannot be empty'
  })
});

export { signInSchema };
