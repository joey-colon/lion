import { TextChannel, MessageReaction, User, GuildChannel, CategoryChannel } from 'discord.js';
import { IHandler, IMessage, ClassType } from '../../common/types';
import { LionClient } from '../../common/client.service';
import { GuildService } from '../../util/guild';

export class ReactHandler implements IHandler {
  private _PIN_THRESH = 5;

  constructor(public client: LionClient) {}

  public async execute(reaction: MessageReaction, user: User): Promise<void> {
    const message = reaction.message;
    if (!message) {
      return;
    }

    const channel = message.channel as TextChannel;

    this._handleClassChannelPinRequest(message, channel);
    await this._handleWarningAcknowledge(reaction, user);
  }

  private async _handleWarningAcknowledge(reaction: MessageReaction, user: User) {
    const warnCat = GuildService.getChannel(user.client, 'warnings') as CategoryChannel;
    const chan = reaction.message.channel as GuildChannel;
    if (chan.parent !== warnCat) {
      return;
    }

    // Dont listen to initial reaction by Lion
    if (reaction.users.cache.last()?.id !== chan.name) {
      return;
    }

    // Make sure its the acknowlege reaction, incase they were to send other reactions
    if (reaction.emoji.name !== this.client.warnings.ACKNOWLEDGE_EMOJI) {
      return;
    }

    await this.client.warnings.deleteChan(user.id);
  }

  private _handleClassChannelPinRequest(message: IMessage, channel: TextChannel) {
    if (!this.client.classes.getClasses(ClassType.ALL).has(channel.name)) {
      return;
    }

    if (message.pinned || !message.pinnable) {
      return;
    }

    const onlyPin = (react: MessageReaction) => react.emoji.name === '📌';

    message
      .awaitReactions(onlyPin, { max: this._PIN_THRESH })
      .then((collection) => {
        const count = collection.first()?.count;
        if (!count) {
          return;
        }

        count >= this._PIN_THRESH && message.pin();
      })
      .catch();
  }
}
