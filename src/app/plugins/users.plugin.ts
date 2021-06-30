import { Plugin } from '../../common/plugin';
import { IMessage, ChannelType, IUser } from '../../common/types';
import Constants from '../../common/constants';
import { GuildManager } from '../../util/guild';

export default class UserCountPlugin extends Plugin {
  public commandName: string = 'users';
  public name: string = 'User Count Plugin';
  public description: string = 'Total member and online member count.';
  public usage: string = 'users';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Bot;

  public execute(message: IMessage) {
    const members = this.client.users.cache.array();
    const totalMembers = GuildManager.getGuild(this.client).memberCount;
    const onlineMembers = members.filter((member: IUser) => {
      return member.presence.status !== 'offline';
    }).length;
    message.reply(
      `${Constants.ServerName} server currently has **${totalMembers} members** (${onlineMembers} currently online).`
    );
  }
}
