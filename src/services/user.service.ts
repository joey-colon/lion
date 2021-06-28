import { GuildMember, Role } from 'discord.js';
import moment from 'moment';
import { Maybe } from '../common/types';
import { ClientService } from './client.service';
import { GuildService } from './guild.service';

export class UserService {
  private _STRIP_NON_NUMERIC: RegExp = /^\d/g;
  public static readonly AGE_THRESHOLD = moment.duration(2, 'days');

  constructor(private _clientService: ClientService) {}

  /**
   * Finds a user by tag, id, or username
   */
  public getMember(target: string): Maybe<GuildMember> {
    const strippedID = target.replace(this._STRIP_NON_NUMERIC, ''); // Remove extra stuff that can come when an @

    return GuildService.getGuild(this._clientService)
      .members.cache.filter((member) => {
        const { nickname } = member;
        const { tag, username, id } = member.user;
        return [nickname, tag, username, id].some((t) => t === target || t === strippedID);
      })
      .first();
  }

  public shouldUnverify(member: GuildMember): boolean {
    const creationDate = member.user.createdTimestamp;
    const accountAge = creationDate;
    return accountAge <= UserService.AGE_THRESHOLD.asMilliseconds();
  }

  public hasRole(member: GuildMember, roleName: string | Role): boolean {
    if (typeof roleName === 'string') {
      const roleNameLower = roleName.toLowerCase();
      return member.roles.cache.filter((r) => r.name.toLowerCase() === roleNameLower).size !== 0;
    }

    return member.roles.cache.filter((r) => r === roleName).size !== 0;
  }
}
