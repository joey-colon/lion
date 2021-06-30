import { Client } from 'discord.js';
import { ClassService } from '../services/class.service';
import { JobService } from '../services/job.service';
import { ModService } from '../services/moderation.service';
import { PluginService } from '../services/plugin.service';
import { PollService } from '../services/poll.service';
import { WarningService } from '../services/warning.service';

export class LionClient extends Client {
  private _startDate: Date;
  public classes!: ClassService;
  public readonly pluginService: PluginService;
  public readonly polls: PollService;
  public readonly jobService: JobService;
  public readonly moderation: ModService;
  public readonly warnings: WarningService;

  constructor() {
    super();
    this.login(process.env.DISCORD_TOKEN);
    this._startDate = new Date();
    this.pluginService = new PluginService();
    this.polls = new PollService(this);
    this.jobService = new JobService();
    this.moderation = new ModService(this);
    this.warnings = new WarningService(this);
  }

  initClasses() {
    this.classes = new ClassService(this);
  }

  public getStartDate() {
    return this._startDate;
  }
}
