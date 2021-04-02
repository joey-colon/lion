import { Plugin } from '../../common/plugin';
import { ChannelType, IContainer, IMessage, ITextMessageOptions } from '../../common/types';

export class CodePlugin extends Plugin {
  public name: string = 'Code Plugin';
  public description: string =
    'Shows someones text in code form (it only works in the channel the command was called in). "Code how" posts a link with formatting help and a quick discord message coding explanation.';
  public usage: string = 'code <message ID/link (optional)> <lang (optional)>/ code how';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Public;

  private codeMessageOptions: ITextMessageOptions = {
    header: '```',
    footer: '```',
  };

  private discordFormatingInfo: string =
    'https://gist.github.com/matthewzring/9f7bbfd102003963f9be7dbcf7d40e51';

  private formattingMessage: string =
    `You can post in Discord like a real boss by refering to this guide ${this.discordFormatingInfo}.  The coding in discord information is located under the third header.\n` +
    `>>> How to code in discord, speed course edition: \n` +
    `\'''<language exstension(optional)>` +
    `\n<Code>\n` +
    `\'''\n` +
    `Replace the ' with \``;

  constructor(public container: IContainer) {
    super();
  }

  public async execute(message: IMessage, args?: string[]) {
    const input = this._parseInput(args || []);
    const messageID = this._inputToMessageID(input[0]);
    this.codeMessageOptions.header += input[1] || '';

    if (!messageID) {
      this.container.messageService.sendTextMessage(message, this.formattingMessage, {});
      return;
    }

    message.channel.messages
      .fetch(messageID)
      .then((targMessage) => {
        this.container.messageService.sendTextMessage(
          message,
          targMessage.content,
          this.codeMessageOptions
        );
      })
      .catch((err) => {
        this.container.loggerService.warn(
          `Failed to add code formatting upon ${message.author.username} request. Error info:\n${err}`
        );
        message.reply('Failed to format the targeted message.');
      });
  }

  public validate(message: IMessage, args?: string[]) {
    const input = this._parseInput(args || []);
    const messageID = this._inputToMessageID(input[0]);

    return input[0] === 'how' || !!messageID;
  }

  private _parseInput(args: string[]): string[] {
    if (args.length < 1) {
      return ['how'];
    }

    return args;
  }

  private _inputToMessageID(input: string): string {
    const id = input.split('/').pop() || '';

    if (this._isNumeric(id)) {
      return id;
    }

    return '';
  }

  private _isNumeric(possibleNumber: any): Boolean {
    return !isNaN(Number(possibleNumber));
  }
}
