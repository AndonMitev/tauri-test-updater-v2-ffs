import { Stronghold as StrongholdPlugin } from 'tauri-plugin-stronghold-api';

const STRONGHOLD_PASSWORD = 'stronghold_password';
const clientName = 'clientName';
const storageName = 'secureStorage';

/**
 * TODO: Add batch read && write
 */
class Stronghold {
  async getClient(stronghold: StrongholdPlugin) {
    try {
      return await stronghold.loadClient(clientName);
    } catch {
      return await stronghold.createClient(clientName);
    }
  }

  async save(key: string, value: string) {
    const storagePath = await this.getStoragePath();
    const stronghold = await StrongholdPlugin.load(
      storagePath,
      STRONGHOLD_PASSWORD
    );
    const client = await this.getClient(stronghold);
    const store = client.getStore();
    await store.insert(key, Array.from(new TextEncoder().encode(value)));
    await stronghold.save();
  }

  async batchSave(keys: string[], values: string[]) {
    if (keys.length !== values.length) {
      throw new Error('Length of keys and values are mismatching');
    }

    const storagePath = await this.getStoragePath();
    const stronghold = await StrongholdPlugin.load(
      storagePath,
      STRONGHOLD_PASSWORD
    );
    const client = await this.getClient(stronghold);
    const store = client.getStore();

    await Promise.all(
      keys.map(async (key, idx) => {
        await store.insert(
          key,
          Array.from(new TextEncoder().encode(values[idx]))
        );
      })
    );

    await stronghold.save();
  }

  async load(key: string) {
    const storagePath = await this.getStoragePath();
    const stronghold = await StrongholdPlugin.load(
      storagePath,
      STRONGHOLD_PASSWORD
    );
    const client = await this.getClient(stronghold);
    const store = client.getStore();
    const value = await store.get(key);
    const decoded = new TextDecoder().decode(new Uint8Array(value ?? []));
    return decoded;
  }

  async batchLoad(keys: string[]) {
    const storagePath = await this.getStoragePath();
    const stronghold = await StrongholdPlugin.load(
      storagePath,
      STRONGHOLD_PASSWORD
    );
    const client = await this.getClient(stronghold);
    const store = client.getStore();

    return await Promise.all(
      keys.map(async (key) => {
        const value = await store.get(key);
        return new TextDecoder().decode(new Uint8Array(value ?? []));
      })
    );
  }

  async reset() {
    const [{ removeFile }, { BaseDirectory }] = await Promise.all([
      import('@tauri-apps/api/fs'),
      import('@tauri-apps/api/path')
    ]);

    return await removeFile(storageName, {
      dir: BaseDirectory.AppConfig
    });
  }

  async getStoragePath() {
    const { appConfigDir } = await import('@tauri-apps/api/path');
    return `${await appConfigDir()}${storageName}`;
  }
}

const strongholdStorage = new Stronghold();

export default strongholdStorage;
