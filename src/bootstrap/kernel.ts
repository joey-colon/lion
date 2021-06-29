import { IContainer as BottleContainer } from 'bottlejs';
import Bottle from 'bottlejs';
import winston from 'winston';

export class Kernel {
  private _container: BottleContainer;

  constructor() {
    const containerBuilder = new Bottle();
    containerBuilder.resolve({});
    this._container = containerBuilder.container;
  }

  boot(): void {
    winston.info('Kernel booted');
  }
}
