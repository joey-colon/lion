import { Bot } from './app/bot';
import dotenv from 'dotenv';
import { StorageService } from './util/storage';
import { LionClient } from './common/lion_client';

(async function main() {
  // Load env vars in.
  dotenv.config();

  // Connect to DB
  await StorageService.connectToDB();

  const app = new Bot(new LionClient());
  app.run();
})();


