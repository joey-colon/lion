import { IHandler } from '../../common/types';
import { ClientService } from '../../services/client.service';

export class ClassChannelHandler implements IHandler {
  constructor(public client: ClientService) {}

  public execute(): void {
    this.client.classes.updateClasses();
  }
}
