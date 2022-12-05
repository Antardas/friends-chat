import { IAuthDocument } from '@auth/interfaces/auth.interface';

import { model, Model, Schema } from 'mongoose';

import { hash, compare } from 'bcryptjs';

const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
  {
    username: {
      type: String
    },
    uId: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    avatarColor: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Before saving the user, hash the password
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
  const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
  this.password = hashedPassword;
  next();
});

// compare password with hashed password in the database to authenticate user login
authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const hashedPassword: string = (this as unknown as IAuthDocument).password!;
  return compare(password, hashedPassword);
};

authSchema.methods.hashPassword = async function (password: string) {
  return hash(password, SALT_ROUND);
};

const Auth: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema);

export { Auth };
