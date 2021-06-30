import { Job } from '../../common/job';
import { LionClient } from '../../common/lion_client';

export class InactiveVoiceJob extends Job {
  public interval: number = 1000 * 60 * 10; // Every 10 mintues
  public name: string = 'Inactive Voice';

  constructor() {
    super();
  }

  public async execute(client: LionClient) {
    const vcs = client.classes.getVoiceChannels();

    for (const vcObj of vcs) {
      const [name, vc] = vcObj;

      // Make sure channel wasnt deleted already
      if (vc.voiceChan.deleted) {
        await client.classes.deleteVoiceChan(name);
        continue;
      }

      const newUsers = vc.voiceChan.members.size;
      if (newUsers === vc.lastUsers && vc.lastUsers === 0) {
        await client.classes
          .deleteVoiceChan(name)
          .then(
            async () =>
              await vc.classChan.send(
                '**Voice channel for this class was removed for being inactive.**'
              )
          );
      } else {
        vc.lastUsers = newUsers;
        client.classes.updateClassVoice(name, vc);
      }
    }
  }
}
