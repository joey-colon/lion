import { TextChannel } from 'discord.js';
import Constants from '../../common/constants';
import { IHandler, IMessage } from '../../common/types';
import { LionClient } from '../../common/lion_client';
import { GuildService } from '../../util/guild';
import { UserService } from '../../util/user';

export class EveryoneHandler implements IHandler {
  constructor(public client: LionClient) {}

  public async execute(message: IMessage): Promise<void> {
    if (!message.content.includes('@everyone') || !message.content.includes('@here')) {
      return;
    }

    if (!message.member) {
      return;
    }

    const isModerator = UserService.hasRole(message.member, 'admin');
    if (isModerator) {
      return;
    }

    const botLogsChannel = GuildService.getChannel(message.client, Constants.Channels.Admin.BotLogs);
    await Promise.all([
      message.author
        .send(
          `\`@everyone\` and \`@here\` pings are not allowed in the ${Constants.ServerName} server`
        )
        .catch(() => {}),
      (botLogsChannel as TextChannel).send(
        `User ${message.author} tried to ping everyone in ${message.channel}`
      ),
    ]);
  }
}
