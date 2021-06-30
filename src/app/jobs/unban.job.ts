import { Job } from '../../common/job';
import { LionClient } from '../../common/client.service';

export class UnBanJob extends Job {
  public interval: number = 1000 * 60 * 60 * 24; // runs each day..
  public name: string = 'unban';

  constructor() {
    super();
  }

  public execute(container: LionClient) {
    container.moderation.checkForScheduledUnBans();
  }
}
