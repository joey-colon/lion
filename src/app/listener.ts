import {
  GuildMember,
  Message,
  MessageEmbed,
  PartialGuildMember,
  PartialMessage,
  TextChannel,
} from 'discord.js';
import winston from 'winston';
import Constants from '../common/constants';
import { IHandler, IMessage, Mode } from '../common/types';
import { ClientService } from '../services/client.service';
import { GuildService } from '../services/guild.service';
import { HandlerService } from '../services/handler.service';
export class Listener {
  private _messageHandlers: IHandler[] = [];
  private _messageUpdateHandlers: IHandler[] = [];
  private _privateMessageHandlers: IHandler[] = [];
  private _channelHandlers: IHandler[] = [];
  private _userUpdateHandlers: IHandler[] = [];
  private _memberAddHandlers: IHandler[] = [];
  private _reactionHandlers: IHandler[] = [];

  constructor(public client: ClientService) {
    this._initializeHandlers();

    this.client.on('channelCreate', async () => {
      await this._executeHandlers(this._channelHandlers);
    });
    this.client.on('channelDelete', async () => {
      await this._executeHandlers(this._channelHandlers);
    });
    this.client.on('channelUpdate', async () => {
      await this._executeHandlers(this._channelHandlers);
    });
    this.client.on('messageReactionAdd', async (reaction, user) => {
      await this._executeHandlers(this._reactionHandlers, reaction, user);
    });

    this.client.on('ready', async () => {
      winston.info(`Loaded ${this.client.jobService.size()} jobs...`);

      this.client.initClasses();

      // Load in plugin states.
      await this.client.pluginService.initPluginState(this.client);

      winston.info('Lion is now running!');

      // Don't need to send this when testing
      // This is useful for knowing when the bot crashed in production and restarts
      if (!process.env.NODE_ENV || process.env.NODE_ENV === Mode.Development) {
        return;
      }

      const notificationChannel = GuildService
        .getChannel(this.client, Constants.Channels.Public.LionProjectGithub) as TextChannel;

      const embed = new MessageEmbed();
      embed
        .setThumbnail(Constants.LionPFP)
        .setTitle('Lion is now running')
        .setColor('#ffca06')
        .setTimestamp(new Date());

      notificationChannel.send(embed);
    });

    this.client.on('message', async (message: IMessage) => {
      await this._handleMessageOrMessageUpdate(message, false);
    });

    this.client.on(
      'messageUpdate',
      async (_old: Message | PartialMessage, newMessage: Message | PartialMessage) => {
        await this._handleMessageOrMessageUpdate(newMessage as Message, true);
      }
    );

    this.client.on(
      'guildMemberUpdate',
      async (
        oldUser: GuildMember | PartialGuildMember,
        newUser: GuildMember | PartialGuildMember
      ) => {
        await this._executeHandlers(this._userUpdateHandlers, oldUser, newUser);
      }
    );

    this.client.on('guildMemberAdd', async (member: GuildMember) => {
      await this._executeHandlers(this._memberAddHandlers, member);
    });
  }

  private async _handleMessageOrMessageUpdate(message: IMessage, isMessageUpdate: boolean) {
    if (message.author.id === this.client.user?.id) {
      return;
    }

    if (message.webhookID) {
      return;
    }

    // If the message has a guild, use regular message handlers
    // Otherwise, it's a DM to handle differently.
    if (message.guild) {
      this._tryEnsureMessageMember(message);

      if (isMessageUpdate) {
        await this._executeHandlers(this._messageUpdateHandlers, message);
      } else {
        await this._executeHandlers(this._messageHandlers, message);
      }
    } else {
      await this._executeHandlers(this._privateMessageHandlers, message);
    }
  }

  // / Tries to make sure that message.member != null
  // / However, message.member may be null if, for example,
  // / the user leaves the guild before we try to look them up.
  private _tryEnsureMessageMember(message: IMessage) {
    if (message.member) {
      return;
    }

    try {
      winston.debug(
        `Attempting extra lookup of ${message.author.tag} to a GuildMember`
      );

      const member = GuildService.getGuild(message.client).members.fetch(message.author.id);

      // Removed as message.member is now read only
      // message.member = member;

      if (!member) {
        winston.warn(
          `Could not resolve ${message.author.tag} to a GuildMember`
        );
      }
    } catch (e) {
      winston.error(
        `While attempting to look up ${message.author.tag} as a GuildMember.`,
        e
      );
    }
  }

  private _initializeHandlers(): void {
    HandlerService.messageHandlers.forEach((Handler) => {
      this._messageHandlers.push(new Handler(this.client));
    });

    HandlerService.messageUpdateHandlers.forEach((Handler) => {
      this._messageUpdateHandlers.push(new Handler(this.client));
    });

    HandlerService.privateMessageHandlers.forEach((Handler) => {
      this._privateMessageHandlers.push(new Handler(this.client));
    });

    HandlerService.channelHandlers.forEach((Handler) => {
      this._channelHandlers.push(new Handler(this.client));
    });

    HandlerService.userUpdateHandlers.forEach((Handler) => {
      this._userUpdateHandlers.push(new Handler(this.client));
    });

    HandlerService.memberAddHandlers.forEach((Handler) => {
      this._memberAddHandlers.push(new Handler(this.client));
    });

    HandlerService.reactionHandlers.forEach((Handler) => {
      this._reactionHandlers.push(new Handler(this.client));
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _executeHandlers(handlers: IHandler[], ...args: any[]) {
    await Promise.all(handlers.map(async (handler: IHandler) => {
      try {
        await handler.execute(...args);
      } catch (e) {
        winston.error(e);
      }
    }));
  }
}
