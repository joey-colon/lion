import Constants from '../../common/constants';
import { Plugin } from '../../common/plugin';
import { ChannelType, IHttpResponse, IMessage, Maybe } from '../../common/types';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import { MessageService } from '../../services/message.service';
import { ClientService } from '../../services/client.service';
import winston from 'winston';

class Breed {
  public name: string = '';
  public id: string = '';
}

export default class CatPlugin extends Plugin {
  public commandName: string = 'cat';
  public name: string = 'Cat Plugin';
  public description: string = 'Generates pictures of cats.';
  public usage: string = 'cat <breed (optional)>';
  public pluginAlias = ['cats'];
  public permission: ChannelType = ChannelType.Public;
  public pluginChannelName: string = Constants.Channels.Public.Pets;

  private _API_URL: string = 'https://api.thecatapi.com/v1/';
  private _breeds: Breed[] = [];
  private _embedBreeds: Maybe<MessageEmbed>;

  constructor(client: ClientService) {
    super(client);
    // creates list of breeds
    axios
      .get(`${this._API_URL}breeds`)
      .then((response: IHttpResponse) => {
        const breeds = response.data;

        this._breeds = breeds.map((breedData: { name: string; id: string }) => {
          return {
            name: breedData.name.toLowerCase(),
            id: breedData.id.toLowerCase(),
          };
        });
      })
      .catch(winston.warn);
  }

  public async execute(message: IMessage, args?: string[]) {
    if (args === undefined || args.length === 0) {
      args = [''];
    }

    if (args[0].includes('breed')) {
      // Simply return the list of supported breeds
      await message.reply((this._getListEmbed()) ?? 'Failed to load breeds.');
      return;
    }

    const breedIn = this._parseCommand(args);

    let searchCom = '';

    // checks if their was a bread was a breed, then if that breed is recognized
    const breedEntry = this._breeds.find((breed) => breed.name === breedIn);

    if (breedEntry !== undefined) {
      searchCom = '&breed_ids=' + breedEntry.id;
    } else if (breedIn !== 'random' && breedIn !== '') {
      message.reply('Breed not found.');
      return;
    }

    winston.debug(searchCom);

    // receives the according info and posts
    await axios
      .get(`${this._API_URL}images/search?limit=1${searchCom}`)
      .then((response: IHttpResponse) => {
        message.reply('', {
          files: [response.data[0].url],
          name:'image.jpg'
        });
      })
      .catch(winston.warn);
  }

  private _getListEmbed() {
    if (this._embedBreeds) {
      return this._embedBreeds;
    }

    const breedsAsArray = this._breeds.map((breedData: { name: string; id: string }) => {
      return breedData.name;
    });

    this._embedBreeds = MessageService.generateEmbedList(breedsAsArray);
    this._embedBreeds.setColor('#0099ff').setTitle('Breeds');

    return this._embedBreeds;
  }

  // gets the commands and puts spaces between all words
  private _parseCommand(args: string[]): string {
    return args.map((str) => str.toLowerCase()).join(' ');
  }
}
