import { Client, GuildMember, Role } from 'discord.js';
import moment from 'moment';
import { Maybe } from '../common/types';
import { GuildService } from './guild.service';

const nonNumeric: RegExp = /^\d/g;
export const AGE_THRESHOLD = moment.duration(2, 'days');

export const UserService = {
  /**
   * Finds a user by tag, id, or username
   */
  getMember(client: Client, target: string): Maybe<GuildMember> {
    const strippedID = target.replace(nonNumeric, ''); // Remove extra stuff that can come when an @

    return GuildService.getGuild(client)
      .members.cache.filter((member) => {
        const { nickname } = member;
        const { tag, username, id } = member.user;
        return [nickname, tag, username, id].some((t) => t === target || t === strippedID);
      })
      .first();
  },

  shouldUnverify(member: GuildMember): boolean {
    const creationDate = member.user.createdTimestamp;
    const accountAge = creationDate;
    return accountAge <= AGE_THRESHOLD.asMilliseconds();
  },

  hasRole(member: GuildMember, roleName: string | Role): boolean {
    if (typeof roleName === 'string') {
      const roleNameLower = roleName.toLowerCase();
      return member.roles.cache.filter((r) => r.name.toLowerCase() === roleNameLower).size !== 0;
    }

    return member.roles.cache.filter((r) => r === roleName).size !== 0;
  }
};
