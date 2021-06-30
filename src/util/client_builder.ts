import { LionClient } from '../common/lion_client';

export const ClientBuilder = async () => {
  // Initialize client
  const client = new LionClient();
  await client.login(process.env.DISCORD_TOKEN);
  client.init();
  client.startDate = new Date();

  return client;
};
