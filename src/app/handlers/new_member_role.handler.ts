import { GuildMember, TextChannel } from 'discord.js';
import { IContainer, IHandler } from '../../common/types';
import Constants from '../../common/constants';
import { AGE_THRESHOLD, UserService } from '../../services/user.service';
import { MessageService } from '../../services/message.service';
import { GuildService } from '../../services/guild.service';

export class NewMemberRoleHandler implements IHandler {
  constructor(public container: IContainer) {}

  public async execute(member: GuildMember): Promise<void> {
    const unverifiedRole = GuildService.getRole(this.container.clientService, Constants.Roles.Unverifed)!;
    const shouldUnverify = UserService.shouldUnverify(member);
    if (!shouldUnverify) {
      return;
    }

    await member.roles.add(unverifiedRole);
    await this._pingUserInVerify(member);
    MessageService.sendBotReport(
      member.client,
      `${member.user} has been automatically unverified.\n\t-Account is less than` +
        `\`${AGE_THRESHOLD.asDays()}\` days old`
    );
  }

  private _pingUserInVerify(member: GuildMember) {
    const verifyChannel = GuildService.getChannel(
      member.client,
      Constants.Channels.Bot.Verify
    ) as TextChannel;

    return verifyChannel.send(member.user.toString()).then((sentMsg) => {
      // Deletes instantly, but user still sees the notification until they view the channel
      sentMsg.delete();
    });
  }
}
