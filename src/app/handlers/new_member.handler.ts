import { GuildMember, Role } from 'discord.js';
import { IContainer, IHandler } from '../../common/types';
import { Maybe } from '../../common/types';

export class NewMemberHandler implements IHandler {
  private _roleCache: Record<string, Maybe<Role>> = {
    'Un Acknowledged': undefined,
    'Un verified': undefined,
  };
  private _UNACKNOWLEDGED_ROLE: string = 'Un Acknowledged';
  private _UNVERIFIED_ROLE: string = 'Un verified';

  constructor(public container: IContainer) {}

  public async execute(member: GuildMember): Promise<void> {
    if (!this._roleCache[this._UNACKNOWLEDGED_ROLE]) {
      Object.keys(this._roleCache).forEach((key) => {
        this._roleCache[key] = member.guild.roles.filter((r) => r.name === key).first();
      });
    }

    //Required to remove optional | undefined
    if (!this._roleCache[this._UNACKNOWLEDGED_ROLE]) {
      return;
    }
    member.addRole(<Role>this._roleCache[this._UNACKNOWLEDGED_ROLE]);

    const hasAvatar = Boolean(member.user.avatar);
    if (hasAvatar) {
      return;
    }

    if (!this._roleCache[this._UNVERIFIED_ROLE]) {
      return;
    }
    member.addRole(<Role>this._roleCache[this._UNVERIFIED_ROLE]);
    this.container.messageService.sendBotReport(
      `User \`${member.user.tag}\` has been automatically unverified`
    );
  }
}
