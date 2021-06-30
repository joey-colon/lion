import { Job } from '../../common/job';
import { Poll } from '../../services/poll.service';
import { LionClient } from '../../common/lion_client';

export class PollJob extends Job {
  public interval: number = 1000 * 60 * 1; // Every minute
  public name: string = 'Poll';

  constructor() {
    super();
  }

  public execute(client: LionClient) {
    const polls: Map<number, Poll> = client.polls.getPolls();
    const now = new Date().getTime();

    Array.from(polls.values())
      .filter((p) => now >= p.expiry.getTime())
      .forEach(async (poll) => {
        const embed = client.polls.createResultEmbed(poll);

        await poll.msg.channel.send(embed).then(() => {
          client.polls.deletePoll(poll);
        });
      });
  }
}
