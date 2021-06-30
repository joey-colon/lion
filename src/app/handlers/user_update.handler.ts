import { GuildMember } from 'discord.js';
import { IHandler } from '../../common/types';
import { LionClient } from '../../common/client.service';
import { MessageService } from '../../util/message';

export class UserUpdateHandler implements IHandler {
  constructor(public client: LionClient) {}

  public execute(oldUser: GuildMember, newUser: GuildMember): void {
    if (oldUser.displayName !== newUser.displayName) {
      MessageService.sendBotReport(
        newUser.client,
        `User ${newUser.user} changed their name from \`${oldUser.displayName}\` to \`${newUser.displayName}\``
      );
    }
  }
}
