import { Plugin } from '../../common/plugin';
import { ChannelType, IMessage } from '../../common/types';

export default class DiceRollPlugin extends Plugin {
  public commandName: string = 'dice';
  public name: string = 'Dice Roll';
  public description: string = 'Roll a die';
  public usage: string = 'dice <number>';
  public pluginAlias = ['d', 'dice'];
  public permission: ChannelType = ChannelType.Public;
  public commandPattern: RegExp = /^(\d+)?$/;

  public async execute(message: IMessage, args: string[]) {
    const upperBound: number = args.length > 0 ? +args[0] : 6;
    const randomNumber: number = Math.ceil(Math.random() * upperBound);
    
    await message.channel.send(`You rolled a \`${randomNumber}\``);
  }
}
