import { GuildMember } from 'discord.js';
import { IContainer, IHandler } from '../../common/types';
import { MessageService } from '../../services/message.service';

export class UserUpdateHandler implements IHandler {
  constructor(public container: IContainer) {}

  public execute(oldUser: GuildMember, newUser: GuildMember): void {
    if (oldUser.displayName !== newUser.displayName) {
      MessageService.sendBotReport(
        newUser.client,
        `User ${newUser.user} changed their name from \`${oldUser.displayName}\` to \`${newUser.displayName}\``
      );
    }
  }
}
