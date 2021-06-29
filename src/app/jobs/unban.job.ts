import { Job } from '../../common/job';
import { ClientService } from '../../services/client.service';

export class UnBanJob extends Job {
  public interval: number = 1000 * 60 * 60 * 24; // runs each day..
  public name: string = 'unban';

  constructor() {
    super();
  }

  public execute(container: ClientService) {
    container.moderation.checkForScheduledUnBans();
  }
}
