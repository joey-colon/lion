import { EmojiIdentifierResolvable } from 'discord.js';
import { IHandler, IMessage, Maybe } from '../../common/types';
import { LionClient } from '../../common/client.service';

export class LionPingHandler implements IHandler {
  private _reactEmoji: Maybe<EmojiIdentifierResolvable> = null;

  constructor(public client: LionClient) {}

  public async execute(message: IMessage) {
    if (!this.client.user) {
      return;
    }

    if (!this._reactEmoji) {
      this._reactEmoji = message.guild?.emojis.cache
        .filter((e) => e.name === 'lion')
        .first() ?? '👍';
    }

    // Check if lion was mentioned.
    const lionId = this.client.user.id;
    if (!message.mentions.has(lionId)) { 
      return;
    }

    await message.react(this._reactEmoji);
  }
}
