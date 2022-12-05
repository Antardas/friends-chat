import Logger from 'bunyan';
import { IUserDocument } from '@user/interfaces/user.interface';
import { BaseCache } from '@service/redis/base.cache';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';

const log: Logger = config.createLogger('redisConnection');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache:redis:');
  }

  // NOTE: userId and uId are the same thing
  public async saveUserToCache(key: string, userId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt: Date = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      followersCount,
      followingCount,
      notifications,
      social,
      bgImageId,
      bgImageVersion,
      profilePicture,
      postsCount,
      work,
      location,
      quote,
      school
    } = createdUser;

    const userDetails: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`
    ];

    const appDetails: string[] = [
      'blocked',
      `${JSON.stringify(blocked)}`,
      'blockedBy',
      `${JSON.stringify(blockedBy)}`,
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      `${JSON.stringify(notifications)}`,
      'social',
      `${JSON.stringify(social)}`
    ];

    const characterDetails: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`
    ];

    const dataToSave: string[] = [...userDetails, ...appDetails, ...characterDetails];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.ZADD('user', {
        score: parseInt(userId, 10),
        value: `${key}`
      });

      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again');
    }
  }
}
