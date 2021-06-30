import { CategoryChannel, TextChannel } from 'discord.js';
import moment from 'moment';
import { Job } from '../../common/job';
import { LionClient } from '../../common/lion_client';
import { GuildManager } from '../../util/guild';

export class WarningJob extends Job {
  public interval: number = moment.duration(5, 'minutes').asMilliseconds();
  public name: string = 'Warning Job';

  public execute(client: LionClient) {
    // Cache the messages in the warning channels so we can listen
    const warnCat = GuildManager.getChannel(client, 'warnings') as CategoryChannel;
    warnCat.children.forEach((chan) => (chan as TextChannel).messages.fetch({ limit: 10 }));
  }
}
