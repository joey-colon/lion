import { CategoryChannel, TextChannel } from 'discord.js';
import moment from 'moment';
import { Job } from '../../common/job';
import { ClientService } from '../../services/client.service';
import { GuildService } from '../../services/guild.service';

export class WarningJob extends Job {
  public interval: number = moment.duration(5, 'minutes').asMilliseconds();
  public name: string = 'Warning Job';

  constructor() {
    super();
  }

  public execute(client: ClientService) {
    // Cache the messages in the warning channels so we can listen
    const warnCat = GuildService.getChannel(client, 'warnings') as CategoryChannel;
    warnCat.children.forEach((chan) => (chan as TextChannel).messages.fetch({ limit: 10 }));
  }
}
