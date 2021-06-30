import { BlacklistHandler } from '../app/handlers/blacklist.handler';
import { ClassChannelHandler } from '../app/handlers/class_channel.handler';
import { CommandHandler } from '../app/handlers/command.handler';
import { RequireUrlHandler } from '../app/handlers/require_url.handler';
import { TagRateLimitHandler } from '../app/handlers/tag_rate_limit.handler';
import { ReactHandler } from '../app/handlers/react.handler';
import { UserUpdateHandler } from '../app/handlers/user_update.handler';
import { NewMemberRoleHandler } from '../app/handlers/new_member_role.handler';
import { WelcomeHandler } from '../app/handlers/welcome.handler';
import { CountingHandler } from '../app/handlers/counting.handler';
import { LionPingHandler } from '../app/handlers/lionping.handler';
import { MemberCountHandler } from '../app/handlers/membercount.handler';
import { EveryoneHandler } from '../app/handlers/everyone.handler';

export const HandlerService = {
  messageHandlers: [
    BlacklistHandler,
    CommandHandler,
    RequireUrlHandler,
    TagRateLimitHandler,
    CountingHandler,
    LionPingHandler,
    EveryoneHandler,
  ],

  messageUpdateHandlers: [
    BlacklistHandler,
    RequireUrlHandler,
    TagRateLimitHandler,
    ReactHandler,
    CountingHandler,
    EveryoneHandler,
  ],

  privateMessageHandlers: [CommandHandler],
  channelHandlers: [ClassChannelHandler],
  userUpdateHandlers: [UserUpdateHandler],
  memberAddHandlers: [NewMemberRoleHandler, WelcomeHandler, MemberCountHandler],
  reactionHandlers: [ReactHandler],
};
