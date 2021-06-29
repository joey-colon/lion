import { ClientService } from '../services/client.service';
import { IJob } from './types';

export abstract class Job implements IJob {
  public name: string = '';
  public interval: number = 60000;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(client?: ClientService) {}
}
