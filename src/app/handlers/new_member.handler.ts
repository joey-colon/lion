import { GuildMember, Role } from 'discord.js';
import { IContainer, IHandler } from '../../common/types';
import { Maybe } from '../../common/types';

export class NewMemberHandler implements IHandler {
  private _roleCache: Record<string, Maybe<Role>> = {
    'Un Acknowledged': undefined,
    'Un verified': undefined,
  };
  constructor(public container: IContainer) {}

  public async execute(member: GuildMember): Promise<void> {
    if (!this._roleCache['Un Acknowledged']) {
      Object.keys(this._roleCache).forEach((key) => {
        this._roleCache[key] = member.guild.roles.filter((r) => r.name === key).first();
      });
    }

    //Required to remove optional | undefined
    if (!this._roleCache['Un Acknowledged']) {
      return;
    }
    member.addRole(this._roleCache['Un Acknowledged']);

    const hasAvatar = Boolean(member.user.avatar);
    if (hasAvatar) {
      return;
    }

    if (!this._roleCache['Un verified']) {
      return;
    }
    member.addRole(this._roleCache['Un verified']);
    this.container.messageService.sendBotReport(
      `User \`${member.user.tag}\` has been automatically unverified`
    );
  }
}