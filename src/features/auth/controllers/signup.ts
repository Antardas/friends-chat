import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { UploadApiResponse } from 'cloudinary';
import { omit } from 'lodash';
import JWT from 'jsonwebtoken';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { signUpSchema } from '@auth/schemas/signUp';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { uploads } from '@global/helpers/cloudinary-upload';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserCache } from '@service/redis/user.cache';
import { config } from '@root/config';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';

const userCache: UserCache = new UserCache();
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

    const userDataForCache: IUserDocument = Signup.prototype.userData(authData, userObjectId); // create user data for cache

    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${userObjectId}`;

    // add to redis cache
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache); // save user to cache

    omit(userDataForCache, ['uId', 'userName', 'email', 'password', 'avatarColor']); // exclude all fields provide in second arguments

    authQueue.addAuthUserJob('addAuthUserToDB', {
      value: userDataForCache
    });
    userQueue.addUserJob('addUserToDB', {
      value: userDataForCache
    });

    const userJWT: string = Signup.prototype.signupToken(authData, userObjectId);
    req.session = { jwt: userJWT };
    res.status(HTTP_STATUS.CREATED).json({
      message: 'User Create Successfully',
      user: userDataForCache,
      token: userJWT
    });
    return; // end of function
  }

  private signupToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
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

  private userData(authData: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, avatarColor, uId, password } = authData;

    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUpperCase(username),
      email: email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
