import { RoleType, RoleTypeKey } from './../common/types';
import { GuildMember, Role, Collection } from 'discord.js';

function getHighestRole(roles: Collection<string, Role>) {
  let highestRole = 0;

  roles.forEach((role: Role) => {
    if (role.name in RoleType) {
      if (role.name === 'Suspended') {return RoleType.Suspended;}
      highestRole = Math.max(highestRole, RoleType[<RoleTypeKey>role.name]);
    }
  });

  return highestRole;
}

export const RoleService = {
  hasPermission(member: GuildMember, minRoleToRun: number) {
    const roles = member.roles;
    const highestRole = getHighestRole(roles.cache);
    return highestRole >= minRoleToRun;
  }
};
