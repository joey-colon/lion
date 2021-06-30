import { Bot } from './app/bot';
import dotenv from 'dotenv';
import { StorageManager } from './util/storage';
import { LogManager } from './util/logger';
import { ClientBuilder } from './util/client_builder';

(async function main() {
  // Load env vars in.
  dotenv.config();

  // Initialize Logger.
  LogManager.initLogger();

  // Connect to DB
  await StorageManager.connectToDB();

  // Log into discord.
  const client = await ClientBuilder();

  const app = new Bot(client);
  app.run();
})();
