import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '../../../shared/globals/decorators/joi-validation.decorators';
import { signUpSchema } from '../schemas/signUp';
import { IAuthDocument, ISignUpData } from '../interfaces/auth.interface';
import { authService } from '../../../shared/services/db/auth.service';
import { BadRequestError } from '../../../shared/globals/helpers/error-handler';
import { Helpers } from '../../../shared/globals/helpers/helpers';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '../../../shared/globals/helpers/cloudinary-upload';

export class Signup {
  @joiValidation(signUpSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email, password, avatarColor, username, avatarImage } = req.body;
    const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);

    if (checkIfUserExist) {
      throw new BadRequestError('User already exist');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomInteger(12)}`;

    const authData: IAuthDocument = Signup.prototype.signupData({
      _id: authObjectId,
      uId,
      email,
      username,
      password,
      avatarColor
    });

    const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!result?.public_id) {
      throw new BadRequestError('Avatar image upload failed. Try Again Later');
    }

    res.status(HTTP_STATUS.CREATED).json({
      message: 'User Create Successfully'
    });
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, password, avatarColor, uId } = data;

    return {
      _id,
      uId,
      username: Helpers.firstLetterUpperCase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }
}
