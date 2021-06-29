import { Plugin } from '../../common/plugin';
import { IMessage, ChannelType, ClassType } from '../../common/types';
import { MessageService } from '../../services/message.service';

export default class ListClassesPlugin extends Plugin {
  public commandName: string = 'listclasses';
  public name: string = 'List Classes Plugin';
  public description: string = 'Returns the current class channels on the server.';
  public usage: string = 'listclasses';
  public pluginAlias = [];
  public permission: ChannelType = ChannelType.Bot;

  public async execute(message: IMessage, args?: string[]) {
    let filter = args && args.length > 0 ? args[0].toUpperCase() : ClassType.ALL;
    let badFilterParam = false;

    if (filter !== ClassType.ALL) {
      filter = this.client.classes.resolveClassType(filter);
      badFilterParam = !filter;
    }

    const response = this.client.classes.buildClassListText(filter);

    response.push('\n You can register for classes through the `!register` command.');

    if (badFilterParam) {
      response.push('\n**The filter supplied is invalid; everything is listed above.**');
    }

    for (const r of response) {
      await MessageService.attemptDMUser(message, r);
    }
  }
}
