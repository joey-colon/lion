import { Plugin } from '../../common/plugin';
import { IMessage, ChannelType } from '../../common/types';
import Constants from '../../common/constants';
import { MessageEmbed, TextChannel } from 'discord.js';
import { MessageService } from '../../util/message';
import { ChannelManager } from '../../util/channel';

export default class HelpPlugin extends Plugin {
  public commandName: string = 'help';
  public name: string = 'Help Plugin';
  public description: string = 'Displays supported commands and usage statements.';
  public usage: string = 'help [Plugin Command]';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.All;

  public async execute(message: IMessage, args?: string[]) {
    const commands = this.client.pluginService.aliases;
    const input: string = this._parseCommand(args ?? []);

    if (commands[input]) {
      const pluginName = commands[input];
      await message.reply(this._generatePluginEmbed(pluginName));
      return;
    }

    if (input === 'all') {
      await MessageService.sendPagedEmbed(message, this._getEmbed(message, 'adv'));
      return;
    }

    MessageService.sendPagedEmbed(message, this._getEmbed(message, 'basic'));
  }

  private _getEmbed(message: IMessage, type: string) {
    const currentChanPerm = ChannelManager.getChannelType(
      (message.channel as TextChannel).name
    );

    const plugins = Object.keys(this.client.pluginService.plugins).filter((p: string) => {
      const plugin = this.client.pluginService.get(p);

      if (plugin.pluginChannelName) {
        return plugin.pluginChannelName === (message.channel as TextChannel).name;
      }

      // Filter out plugins that don't work in current channel
      return plugin.permission === currentChanPerm;
    });

    return this.client.pluginService.generateHelpEmbeds(plugins, type);
  }

  private _generatePluginEmbed(targ: string) {
    const plugin = this.client.pluginService.plugins[targ];
    const aliases = plugin.pluginAlias ?? [];

    // Single Plugins are not paged
    const targEmbed = new MessageEmbed();
    const altCalls = `aliases: ${aliases.length !== 0 ? aliases.join(', ') : 'None'} \n`;

    targEmbed.setColor('#0099ff').setTitle(`**__${plugin.name}__**`);
    targEmbed.addField(`${Constants.Prefix}${plugin.usage}`, `${altCalls}${plugin.description}`);

    return targEmbed;
  }

  // gets the commands and puts spaces between all words
  private _parseCommand(args: string[]): string {
    return args.map((str) => str.toLowerCase()).join(' ');
  }
}
