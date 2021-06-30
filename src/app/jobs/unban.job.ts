import { Job } from '../../common/job';
import { LionClient } from '../../common/lion_client';

export class UnBanJob extends Job {
  public interval: number = 1000 * 60 * 60 * 24; // runs each day..
  public name: string = 'unban';

  public execute(container: LionClient) {
    container.moderation.checkForScheduledUnBans();
  }
}
