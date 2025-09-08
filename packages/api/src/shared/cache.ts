import fs from "node:fs";
import path from "node:path";

type Options<T> = {
  key: string;
  ttl: number;
  function: () => Promise<T[]>;
  primaryKey: keyof T;
};

export class Cache<T> {
  constructor(options: Options<T>) {
    this.options = options;
  }

  private options: Options<T> = {
    key: "",
    ttl: 0,
    function: () => Promise.resolve([]),
    primaryKey: "" as keyof T,
  };

  private _cacheDirectoryPath(): string {
    return path.join(process.cwd(), ".cache");
  }

  private _cacheFilePath(): string {
    return path.join(this._cacheDirectoryPath(), `${this.options.key}.json`);
  }

  private async _read(): Promise<{
    data: Record<string, T>;
    lastFetchTime: number;
  }> {
    if (!fs.existsSync(this._cacheDirectoryPath())) {
      await fs.promises.mkdir(this._cacheDirectoryPath());
    }

    if (!fs.existsSync(this._cacheFilePath())) {
      await fs.promises.writeFile(
        this._cacheFilePath(),
        JSON.stringify({
          data: {},
          lastFetchTime: 0,
        }),
      );
    }

    const cache = await fs.promises.readFile(this._cacheFilePath(), "utf-8");

    return JSON.parse(cache);
  }

  private async _write(data: Record<string, T>) {
    await fs.promises.writeFile(
      this._cacheFilePath(),
      JSON.stringify({
        data,
        lastFetchTime: Date.now(),
      }),
    );
  }

  private async _cachedRead(): Promise<Record<string, T>> {
    const { data, lastFetchTime } = await this._read();

    if (lastFetchTime + this.options.ttl > Date.now()) {
      return data;
    }

    console.log(`Cache "${this.options.key}" miss`);
    const freshDataMap = this._toMap(await this.options.function());
    await this._write(freshDataMap);

    return freshDataMap;
  }

  private _toMap(data: T[]): Record<string, T> {
    return data.reduce(
      (acc, item) => {
        acc[item[this.options.primaryKey] as string] = item;
        return acc;
      },
      {} as Record<string, T>,
    );
  }

  private _fromMap(data: Record<string, T>): T[] {
    return Object.values(data);
  }

  public async get(): Promise<T[]> {
    return this._fromMap(await this._cachedRead());
  }

  public async getByPrimaryKey(primaryKey: string): Promise<T | undefined> {
    const data = await this._cachedRead();

    if (!(primaryKey in data)) {
      return undefined;
    }

    return data[primaryKey];
  }
}
