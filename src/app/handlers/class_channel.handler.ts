import { IHandler } from '../../common/types';
import { LionClient } from '../../common/lion_client';

export class ClassChannelHandler implements IHandler {
  constructor(public client: LionClient) {}

  public execute(): void {
    this.client.classes.updateClasses();
  }
}
