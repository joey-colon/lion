import { Client } from 'discord.js';
import { ClassService } from '../services/class.service';
import { JobService } from '../services/job.service';
import { ModService } from '../services/moderation.service';
import { PluginService } from '../services/plugin.service';
import { PollService } from '../services/poll.service';
import { WarningService } from '../services/warning.service';

export class LionClient extends Client {
  public startDate!: Date;
  public classes!: ClassService;
  public pluginService!: PluginService;
  public polls!: PollService;
  public jobService!: JobService;
  public moderation!: ModService;
  public warnings!: WarningService;

  init() {
    this.classes = new ClassService(this);
    this.pluginService = new PluginService();
    this.polls = new PollService(this);
    this.jobService = new JobService();
    this.moderation = new ModService(this);
    this.warnings = new WarningService(this);
  }
}
