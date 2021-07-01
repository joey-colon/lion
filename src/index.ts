import { Bot } from './app/bot';
import dotenv from 'dotenv';
import { StorageManager } from './util/storage';
import { LogManager } from './util/logger';
import { LionClient } from './common/lion_client';

(async function main() {
  // Load env vars in.
  dotenv.config();

  // Initialize Logger.
  LogManager.initLogger();

  // Connect to DB
  await StorageManager.connectToDB();

  // Log into discord.
  const client = new LionClient();
  await client.login(process.env.DISCORD_TOKEN);

  const app = new Bot(client);
  app.run();
})();
