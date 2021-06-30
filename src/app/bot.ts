import fs from 'fs';
import { Store } from '../common/store';
import express, { Express } from 'express';
import Server from 'http';
import { Plugin } from '../common/plugin';
import { LionClient } from '../common/lion_client';
import winston from 'winston';
import { StoreService } from '../services/store.service';
import { Listener } from './listener';

export class Bot {
  private _listener!: Listener;
  private _webServer!: Express;
  public client: LionClient;
  private _webServerInstance: Server.Server | undefined;

  constructor(client: LionClient) {
    this.client = client;
    this._initialise();
  }

  private _initialise(): void {
    this._listener = new Listener(this.client);
    this._webServer = express();
  }

  private _loadAndRun(): void {
    this._registerPlugins();
    this._registerJobs();
    this._registerStores();
    this._registerWebServer();
  }

  private _registerPlugins(): void {
    this.client.pluginService.reset();

    const pluginFolder = './src/app/plugins';
    fs.readdir(pluginFolder, (_err, files) => {
      files.forEach(async file => {

        // Import the class from the plugin file.
        const pluginInstance = await import(`./plugins/${file}`);

        // Try to see if it's in the proper form.
        try {
          // Check constructor.
          const plugin = new pluginInstance.default(this.client);

          // Check instance.
          if (!(plugin instanceof Plugin)) {
            winston.error(`${file} has a default export, but it is not of type Plugin`);
            return;
          }

          // Register plugin.
          this.client.pluginService.register(plugin);
        } catch(err) {
          winston.warn(`${file} doesn't have a default export of type Plugin!`);
        }
      });
    });
  }

  private _registerJobs() {
    this.client.jobService.reset();

    const jobs = this.client.jobService.jobs;
    for (const job of jobs) {
      this.client.jobService.register(job, this.client);
    }
  }

  private _registerStores() {
    StoreService.reset();

    StoreService.STORES.forEach((store: Store) => {
      StoreService.register(store);
    });
  }

  private _registerWebServer() {
    // reset web server before trying to init again, in case we are retrying
    this._resetWebServer();

    const defaultPort = 3000;
    this._webServerInstance = this._webServer.listen(process.env.WEBSERVER_PORT ?? defaultPort, () =>
      winston.info('Webserver is now running')
    );

    this._webServer.get('/health', (_, res) => res.send('OK'));
  }

  private _resetWebServer() {
    this._webServerInstance?.close((err) => {
      if (err) {
        winston.error('While closing webServerInstance: ' + err);
      }
    });
  }

  public async run() {
    while (true) {
      try {
        winston.info('Loading and running Bot...');
        this._loadAndRun();

        winston.info('Bot loaded. Sleeping thread until error.');
        // sleep infinitely, waiting for error
        while (true) {
          const waiting = new Promise((resolve) => setTimeout(resolve, 1_000_000_000));
          await waiting;
        }
      } catch (e) {
        winston.error('Bot crashed with error: ' + e);

        // re-init everything before restarting loop
        this._initialise();
      }
    }
  }
}
