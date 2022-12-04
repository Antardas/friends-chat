import Logger from 'bunyan';
import { config } from '../../../config';
import { BaseCache } from './base.cache';

const log: Logger = config.createLogger('redisConnection');

// Inherit from BaseCache to get the client and log properties
class RedisConnection extends BaseCache {
  constructor() {
    super('redisConnection');
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.log.error(error);
    }
  }
}

export const redisConnection: RedisConnection = new RedisConnection();
