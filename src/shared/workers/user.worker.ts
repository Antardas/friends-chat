import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';

const log: Logger = config.createLogger('auth.worker');

/**
 * This class is responsible for processing jobs from the auth queue
 */
class UserWorker {
  /**
   *
   * @description This function is called when a job is added to the queue and is ready to be processed by a worker
   */
  async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await userService.addUserData(value);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
