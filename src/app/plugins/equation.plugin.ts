import { MessageAttachment } from 'discord.js';
import { Plugin } from '../../common/plugin';
import { IContainer, ChannelType, IMessage } from '../../common/types';
import axios from 'axios';

export class TexPlugin extends Plugin {

    public name: string = 'Equation Plugin';
    public description: string = 'A plugin that generated equations given a tex string.';
    public usage: string = 'eqn <equation> <image-height>';
    public permission: ChannelType = ChannelType.Public;
    public commandPattern: RegExp = /^(?!\s*$).+/;
    public pluginAlias: string[] = ['eqn'];

    private static readonly _BASE_URL = 'https://chart.googleapis.com/chart';

    constructor(public container: IContainer) {
      super();
    }

    public async execute(message: IMessage, args: string[]): Promise<void> {

      // Parse height argument.
      const chs = args.length > 1 ? parseFloat(args[1]) : 40;

      // Define the properties of the image.
      const params = {
        cht: 'tx',
        chl: args[0],
        chs,
        chf: 'bg,s,00000000',
        chco: 'FFFFFF',
      };

      // Fetch result. (Can't use container.httpServer because it doesn't allow options.)
      const result = await axios.get(TexPlugin._BASE_URL, {
        params,
        responseType: 'arraybuffer',
      });

      // Capture buffer.
      const buffer = Buffer.from(result.data, 'base64');
      
      // Create attachment.
      const attachment = new MessageAttachment(buffer, 'equation.png');

      // Send message.
      await message.channel.send({ files: [attachment] });
    }
    
}
