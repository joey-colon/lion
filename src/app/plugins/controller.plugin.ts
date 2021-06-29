import { Plugin } from '../../common/plugin';
import { ChannelType, IMessage } from '../../common/types';

export default class PluginControl extends Plugin {
  public commandName: string = 'controller';
  public name: string = 'controller';
  public description: string = 'Controls activating and deactivating plugins.';
  public usage: string = 'controller <activate | deactive> <plugin name>';
  public permission: ChannelType = ChannelType.Admin;
  public commandPattern: RegExp = /^(deactivate|activate) (?!\s*$).+/;

  public async execute(message: IMessage, args: string[]): Promise<void> {
    const [method, pluginName] = args;

    try {
      await this.client.pluginService.setPluginState(pluginName, method === 'activate') ;
    } catch(e) {
      await message.channel.send(e.message);
      return;
    }
  
    message.channel.send(`${pluginName} has been ${method}d`);
  }
}
