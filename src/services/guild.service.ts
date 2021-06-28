import { Guild, Role, User, GuildChannel, Client } from 'discord.js';

export const GuildService = {
  getGuild(client: Client): Guild {
    return client.guilds.cache.first()!;
  },

  userHasRole(user: User, roleName: string | Role) {
    const { client } = user;
    const member = this.getGuild(client).members.cache.get(user.id);
    if (!member) {
      return false;
    }

    if (typeof roleName === 'string') {
      const roleNameLower = roleName.toLowerCase();
      return member.roles.cache.filter((r) => r.name.toLowerCase() === roleNameLower).size !== 0;
    } else {
      return member.roles.cache.filter((r) => r === roleName).size !== 0;
    }
  },

  getRole(client: Client, roleName: string): Role | undefined {
    return this.getGuild(client)
      .roles.cache.filter((r) => r.name === roleName)
      .first();
  },

  getChannel(client: Client, chanName: string): GuildChannel | undefined {
    return this.getGuild(client)
      .channels.cache.filter((c) => c.name === chanName)
      .first();
  }
};
