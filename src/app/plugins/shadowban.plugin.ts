import { Plugin } from '../../common/plugin';
import { IMessage, ChannelType } from '../../common/types';
import Constants from '../../common/constants';
import { CategoryChannel, Collection, Guild, GuildChannel, User } from 'discord.js';
import { GuildService } from '../../services/guild.service';
import { ClientService } from '../../services/client.service';

export default class ShadowBanPlugin extends Plugin {
  public commandName: string = 'shadowban';
  public name: string = 'Shadowban Plugin';
  public description: string = 'Disables a users ability to view public channels.';
  public usage: string = 'shadowban <ban|unban> <user>';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Staff;
  public pluginChannelName: string = Constants.Channels.Staff.UserOffenses;
  public commandPattern: RegExp = /(ban|unban)\s[^#]+#\d{4}/;

  private _guild: Guild;
  private _BANNED_CATEGORIES: string[] = [
    'GENERAL & SCHOOL LIFE',
    'DAILY ROUTINE',
    'HELP',
    'SPECIAL TOPICS',
    'MISCELLANEOUS',
    'AUDIO CHANNELS',
  ];

  constructor(public client: ClientService) {
    super(client);
    this._guild = GuildService.getGuild(client);
  }

  public async execute(message: IMessage, args: string[]) {
    const [subCommand, ...userArg] = args;
    const targetUser = userArg.join(' ');
    const user = this._guild
      .members.cache.filter((m) => m.user.tag === targetUser)
      .first()?.user;

    if (!user) {
      await message.reply('User not found.');
      return;
    }

    if (subCommand === 'ban') {
      await this._applyToChannels(this._banUser(user));
      await message.reply(`${user.tag} has been shadowbanned`);
      return;
    } else if (subCommand === 'unban') {
      await this._applyToChannels(this._unbanUser(user));
      await message.reply(`${user.tag} has been unshadowbanned`);
      return;
    }
  }

  private async _applyToChannels(callback: (chan: GuildChannel) => void) {
    const categories = this._guild
      .channels.cache.filter((chan) => chan.type === 'category') as Collection<
      string,
      CategoryChannel
    >;

    const catsToBan = categories.filter((cat: CategoryChannel) => {
      const chanName = cat.name.toUpperCase();
      return this._BANNED_CATEGORIES.some((n) => chanName === n);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises = catsToBan.reduce((acc: any, cat: CategoryChannel) => {
      acc.push(...cat.children.array().map(callback));
      return acc;
    }, []);

    await Promise.all(promises);
  }

  private _banUser(user: User) {
    return async (chan: GuildChannel) => {
      await chan.createOverwrite(user.id, {
        VIEW_CHANNEL: false,
      });
    };
  }

  private _unbanUser(user: User) {
    return async (chan: GuildChannel) => {
      await chan.permissionOverwrites.get(user.id)?.delete();
    };
  }
}
