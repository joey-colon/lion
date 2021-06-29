import { Store } from '../common/store';

export class StoreService {
  public static STORES: Store[] = [];
  private static _stores: { [storeName: string]: Store } = {};

  public static register(store: Store) {
    if (StoreService._stores[store.name]) {
      throw new Error(`Store ${store.name} already exists as a store.`);
    }
    StoreService._stores[store.name] = store;
  }

  public static get(storeName: string): Store {
    if (!StoreService._stores[storeName]) {
      throw new Error(`Unable to locate ${storeName}`);
    }
    return StoreService._stores[storeName];
  }

  public static reset() {
    StoreService._stores = {};
  }
}
