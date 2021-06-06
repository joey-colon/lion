import { MessageEmbed } from 'discord.js';
import { PluginLoader } from '../bootstrap/plugin.loader';
import Constants from '../common/constants';
import { IPlugin, ICommandLookup, IPluginLookup, IContainer } from '../common/types';

export class PluginService {
  public plugins: IPluginLookup = {};
  public aliases: ICommandLookup = {};

  private readonly _NUM_DISPLAY = 10;

  get(pluginName: string): IPlugin {
    return this.plugins[pluginName];
  }

  register(pluginName: string, container: IContainer): IPlugin {
    if (this.plugins[pluginName]) {
      throw new Error(`${pluginName} already exists as a plugin.`);
    }

    const reference = (this.plugins[pluginName] = new PluginLoader(
      pluginName,
      container
    ) as IPlugin);

    this.registerAliases(pluginName);

    return reference;
  }

  registerAliases(pluginName: string): void {
    const aliases = this.plugins[pluginName].pluginAlias;

    if (!aliases) {
      this.aliases[pluginName] = pluginName;
    } else {
      if (!aliases.includes(pluginName)) {
        if (this.aliases[pluginName]) {
          throw new Error(
            `Duplicate alias detected: ${pluginName} is claiming its primary alias ${pluginName}, previously claimed by ${this.aliases[pluginName]}.`
          );
        }
        this.aliases[pluginName] = pluginName;
      }

      aliases.forEach((alias: string) => {
        if (this.aliases[alias] && this.aliases[alias] !== pluginName) {
          throw new Error(
            `Duplicate alias detected: ${pluginName} is trying to claim ${alias}, but ${this.aliases[alias]} has already claimed it.`
          );
        }
        this.aliases[alias] = pluginName;
      });
    }
  }

  public reset() {
    this.plugins = {};
    this.aliases = {};
  }

  public generateHelpEmbeds(pluginNames: string[], type: string) {
    const plugins = pluginNames.map((pluginName) => this.get(pluginName));

    const numPages = Math.ceil(plugins.length / this._NUM_DISPLAY);

    // Create pages and return
    return [...new Array(numPages)].map(() => {
      const page = new MessageEmbed();
      page.setColor('#0099ff').setTitle('**__These are the commands I support__**');

      for (const plugin of plugins.splice(0, this._NUM_DISPLAY)) {
        const aliases = plugin.pluginAlias || [];
        const altCalls = `aliases: ${aliases.length != 0 ? aliases.join(', ') : 'None'} \n`;

        page.addField(
          `${Constants.Prefix}${plugin.usage}`,
          `${type == 'adv' ? altCalls : ''}${plugin.description}`
        );
      }
      return page;
    });
  }
}
