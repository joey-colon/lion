import { IHandler } from '../../common/types';
import { LionClient } from '../../common/client.service';

export class ClassChannelHandler implements IHandler {
  constructor(public client: LionClient) {}

  public execute(): void {
    this.client.classes.updateClasses();
  }
}
