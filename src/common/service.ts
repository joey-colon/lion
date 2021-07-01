import { LionClient } from './lion_client';
import { GuildManager } from '../util/guild';

export abstract class Service {
  constructor(public client: LionClient) {}

  public get guild() {
    return GuildManager.getGuild(this.client);
  }
}
