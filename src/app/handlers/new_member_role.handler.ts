import { GuildMember, TextChannel } from 'discord.js';
import { IHandler } from '../../common/types';
import Constants from '../../common/constants';
import { AGE_THRESHOLD, UserService } from '../../util/user';
import { MessageService } from '../../util/message';
import { GuildManager } from '../../util/guild';
import { LionClient } from '../../common/lion_client';

export class NewMemberRoleHandler implements IHandler {
  constructor(public client: LionClient) {}

  public async execute(member: GuildMember): Promise<void> {
    const unverifiedRole = GuildManager.getRole(this.client, Constants.Roles.Unverifed)!;
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
    const verifyChannel = GuildManager.getChannel(
      member.client,
      Constants.Channels.Bot.Verify
    ) as TextChannel;

    return verifyChannel.send(member.user.toString()).then((sentMsg) => {
      // Deletes instantly, but user still sees the notification until they view the channel
      sentMsg.delete();
    });
  }
}
