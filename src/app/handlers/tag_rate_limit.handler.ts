import { IHandler, IMessage } from '../../common/types';
import { Guild } from 'discord.js';
import { MessageService } from '../../util/message';
import { GuildService } from '../../util/guild';
import { LionClient } from '../../common/lion_client';
import winston from 'winston';

export class TagRateLimitHandler implements IHandler {
  private _MAX_ROLES_TAGGED = 6;
  private _TAG_RATE_DURATION: number = 5 * 60 * 1000; // 5 minutes in ms

  private _TAGS_MAP = new Map<Guild, Map<string, number[]>>();

  constructor(public client: LionClient) {}

  public execute(message: IMessage) {
    // guard against message.member being null
    if (!message || !message.member || !message.member.id) {
      return;
    }

    const guild = GuildService.getGuild(message.client);

    const guild_map: Map<string, number[]> =
      this._TAGS_MAP.get(guild) ?? new Map<string, number[]>();

    guild_map.set(message.member.id, guild_map.get(message.member.id) ?? []);

    const dates: number[] = guild_map.get(message.member.id) ?? [];

    message.mentions.roles.forEach(() => {
      dates.push(Date.now());
    });

    if (dates.length >= this._MAX_ROLES_TAGGED) {
      const time_since = dates[0] - dates[dates.length - 1];
      if (time_since <= this._TAG_RATE_DURATION) {
        MessageService.sendBotReportOnMessage(message);
        winston.info('Sent bot report.');
      }
      dates.splice(0, dates.length);
    }

    // upd stuff... by reference, should be fast
    guild_map.set(message.member.id, dates);
    this._TAGS_MAP.set(guild, guild_map);
  }
}
