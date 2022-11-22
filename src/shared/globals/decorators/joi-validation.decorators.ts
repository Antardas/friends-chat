/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { ObjectSchema } from 'joi';

import { JoiRequestValidationError } from '../helpers/error-handler';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
