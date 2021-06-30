import { TextChannel } from 'discord.js';
import Constants from '../../common/constants';
import { IHandler, IMessage, ClassType } from '../../common/types';
import { LionClient } from '../../common/client.service';
import { MessageService } from '../../util/message';
import { Moderation } from '../../services/moderation.service';
import { UserService } from '../../util/user';

interface ILinkLabel {
  regex: RegExp;
  label: string;
}

export class BlacklistHandler implements IHandler {
  private _expressions: ILinkLabel[] = [
    { regex: /discord\.gg/, label: 'discord' },
    { regex: /group(\.me|me\.com)/, label: 'GroupMe' },
    { regex: /chegg\.com/, label: 'Chegg' },
    { regex: /coursehero\.com/, label: 'CourseHero' },
    { regex: /quizlet\.com/, label: 'Quizlet' },
  ];

  private _whitelistedChannels = new Set([Constants.Channels.Public.Clubs]);
  constructor(public client: LionClient) {}

  public execute(message: IMessage): void {
    const channel = message.channel as TextChannel;
    const member = message.member;
    if (!member) {
      return;
    }

    // Whitelist moderators
    if (UserService.hasRole(member, 'Moderator')) {
      return;
    }

    if (this._whitelistedChannels.has(channel.name)) {
      return;
    }

    this._expressions.forEach(({ regex, label }) => {
      if (message.content.toLowerCase().match(regex)) {
        message.author.send(
          `Please do not share \`${label}\` links in the \`${
            message.guild!.name
          }\` server.`
        );
        MessageService.sendBotReportOnMessage(message);
        const rep = new Moderation.Report(
          message.guild!,
          message.author.tag,
          `Shared a ${label} link.`
        );
        this.client.moderation.fileReport(rep);
        message.delete();
        return;
      }
    });

    const isClassChannel = this.client.classes.getClasses(ClassType.ALL).has(channel.name);
    const hasBackticks = message.content.toLowerCase().match(/```/);
    const hasAttachment = message.attachments.size;

    if (isClassChannel && (hasBackticks || hasAttachment)) {
      MessageService.sendBotReportOnMessage(message);
    }
  }
}
