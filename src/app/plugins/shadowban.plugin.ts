import { Plugin } from '../../common/plugin';
import { IContainer, IMessage, ChannelType } from '../../common/types';
import Constants from '../../common/constants';
import {
  CategoryChannel,
  Collection,
  Guild,
  GuildChannel,
  PermissionOverwrites,
  User,
} from 'discord.js';

export class ShadowBanPlugin extends Plugin {
  public name: string = 'Shadowban Plugin';
  public description: string = 'Disables a users ability to view public channels.';
  public usage: string = 'shadowban <ban|unban> <user>';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Staff;
  public pluginChannelName: string = Constants.Channels.Staff.UserOffenses;

  private BANNED_CATEGORIES: string[] = [
    'GENERAL & SCHOOL LIFE',
    'DAILY ROUTINE',
    'HELP',
    'SPECIAL TOPICS',
    'MISCELLANEOUS',
    'AUDIO CHANNELS',
  ];

  constructor(public container: IContainer) {
    super();
  }

  public validate(message: IMessage, args: string[]) {
    return args && args.length > 1;
  }

  public async execute(message: IMessage, args: string[]) {
    const [subCommand, ...userArg] = args;
    const targetUser = userArg.join(' ');
    const user = this.container.guildService
      .get()
      .members.filter((m) => m.user.tag === targetUser)
      .first().user;

    if (!user) {
      message.reply('User not found.');
      return;
    }

    if (subCommand === 'ban') {
      this._applyToChannels(this._banUser(user));
      message.reply(`${user.tag} has been shadowbanned`);
      return;
    } else if (subCommand === 'unban') {
      this._applyToChannels(this._unbanUser(user));
      message.reply(`${user.tag} has been unshadowbanned`);
      return;
    } else {
      message.reply(`Invalid subcommand\nTry: \`${this.usage}\``);
    }
  }

  private async _applyToChannels(callback: (chan: GuildChannel) => void) {
    const categories = this.container.guildService
      .get()
      .channels.filter((chan) => chan.type === 'category') as Collection<string, CategoryChannel>;

    const catsToBan = categories.filter((cat: CategoryChannel) => {
      const chanName = cat.name.toUpperCase();
      return this.BANNED_CATEGORIES.some((n) => chanName === n);
    });

    const promises = catsToBan.reduce((acc, cat: CategoryChannel) => {
      acc.push(...cat.children.array().map((chan: GuildChannel) => callback(chan)));
      return acc;
    }, []);

    await Promise.all(promises);
  }

  private _banUser(user: User) {
    return (chan: GuildChannel) => {
      chan.overwritePermissions(user, {
        VIEW_CHANNEL: false,
      });
    };
  }

  private _unbanUser(user: User) {
    return (chan: GuildChannel) => {
      chan.permissionOverwrites.get(user.id)?.delete();
    };
  }
}
