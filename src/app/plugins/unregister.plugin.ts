import winston from 'winston';
import { Plugin } from '../../common/plugin';
import { IMessage, ChannelType, IEmbedData, ClassType } from '../../common/types';
import { MessageService } from '../../util/message';

export default class UnregisterPlugin extends Plugin {
  public commandName: string = 'unregister';
  public name: string = 'Unregister Plugin';
  public description: string = 'Allows for you to unregister classes.';
  public usage: string = 'unregister <class_name>';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Bot;

  public validate(message: IMessage, args: string[]) {
    return args.filter((arg) => !!arg).length > 0;
  }

  public async execute(message: IMessage, args: string[]) {
    if (args[0].toLowerCase() === 'all') {
      await this._removeFromAllClasses(message);
      return;
    }

    let numSuccessfulClasses = 0;
    const invalidClasses: string[] = [];

    for (const arg of args) {
      const request = this.client.classes.buildRequest(message.author, [arg]);
      if (!request) {
        invalidClasses.push(arg);
        continue;
      }

      try {
        const response = await this.client.classes.unregister(request);
        if (response.includes('success')) {
          numSuccessfulClasses++;
        } else {
          invalidClasses.push(arg);
        }
      } catch (e) {
        winston.error(e);
      }
    }

    if (numSuccessfulClasses !== 0) {
      await message.reply(`Successfully removed from ${numSuccessfulClasses} classes`);
    }

    if (invalidClasses.length <= 0) {
      return;
    }

    if (this.client.classes.getClasses(ClassType.ALL).size === 0) {
      await message.reply('No classes found at this time.');
      return;
    }

    const embedMessages: IEmbedData[] = this.client.classes.getSimilarClasses(
      message,
      invalidClasses
    );

    // Ships it off to the message Service to manage sending the message and its lifespan
    await Promise.all(
      embedMessages.map((embedData) => {
        return MessageService.sendReactiveMessage(
          message,
          embedData,
          this.client.classes.removeClass,
          {
            reactionCutoff: 1,
            cutoffMessage: `Successfully unregistered to ${embedData.emojiData[0].args.classChan ||
              'N/A'}.`,
            closingMessage: `Closed unregistering offer to ${embedData.emojiData[0].args
              .classChan || 'N/A'}.`,
          }
        );
      })
    );
  }

  private async _removeFromAllClasses(message: IMessage) {
    const request = this.client.classes.buildRequest(message.author, ['all']);
    if (!request) {
      await message.reply('Unable to complete your request.');
      return;
    }

    const response = await this.client.classes.unregister(request);
    message.reply(response);
  }
}
