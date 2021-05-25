import { Plugin } from '../../common/plugin';
import { IContainer, IMessage, ChannelType } from '../../common/types';

export class BubbleWrapPlugin extends Plugin {
  public name: string = 'Bubble Wrap';
  public description: string = 'Sends the user a sheet of bubble wrap to pop';
  public usage: string = 'bubblewrap';
  public pluginAlias = ['bw'];
  public permission: ChannelType = ChannelType.Public;

  constructor(public container: IContainer) {
    super();
  }

  public async execute(message: IMessage, args: string[]) {
    const wrap: string = "_\n_" + "||pop||||pop||||pop||||pop||||pop||\n".repeat(5);
    console.log(wrap)
    await message.channel.send(wrap);
  }
}
