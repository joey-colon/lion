import { Bot } from './app/bot';
import dotenv from 'dotenv';
import { StorageService } from './services/storage.service';

(async function main() {
  // Load env vars in.
  dotenv.config();

  // Connect to DB
  await StorageService.connectToDB();

  const app = new Bot();
  app.run();
})();


