import { Job } from '../../common/job';
import Constants from '../../common/constants';
import { TextChannel } from 'discord.js';
import { GuildService } from '../../util/guild';
import { LionClient } from '../../common/lion_client';
import winston from 'winston';

export class PoliticsCoCReminder extends Job {
  public interval: number = 1000 * 60 * 30; // every 30 minutes
  public name: string = 'politics_coc_reminder';

  constructor() {
    super();
  }

  public execute(client: LionClient) {
    try {
      winston.debug(`Starting ${this.name} job`);

      const guild = GuildService.getGuild(client);
      if (!guild) {
        winston.warn('No guild yet');
        return;
      }

      // console.log(container.guildService.get().channels);

      const politicsChan = guild
        .channels.cache.find((c) => c.name === Constants.Channels.Public.Politics);

      if (!politicsChan) {
        winston.silly("no politics channel detected (it's for the best)");
        return;
      }

      const codeOfConduct = GuildService.getGuild(client)
        .channels.cache.find((c) => c.name === Constants.Channels.Info.CodeOfConduct);

      if (!codeOfConduct) {
        winston.silly('no code of conduct channel detected');
        return;
      }

      (politicsChan as TextChannel).send(
        `Please remember to follow the <#${codeOfConduct.id}>, especially in this channel!`
      );
    } catch (ex) {
      winston.error(ex);
      console.log(ex);
    }
  }
}
