import { Plugin } from '../../common/plugin';
import { IMessage, ChannelType, ClassType } from '../../common/types';
import { MessageService } from '../../util/message';

export default class FetchClassChannelsPlugin extends Plugin {
  public commandName: string = 'fetchclasschans';
  public name: string = 'Fetches classes';
  public description: string = 'Fetches a list of current CS/IT classes';
  public usage: string = 'fetchclasschans';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Admin;

  public async execute(message: IMessage) {
    const response = ['Current classes:\n'];
    response.push(...this.client.classes.buildClassListText(ClassType.ALL));
    for (const r of response) {
      await MessageService.attemptDMUser(message, r);
    }
  }
}
