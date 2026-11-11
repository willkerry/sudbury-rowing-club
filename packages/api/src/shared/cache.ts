type Options<T> = {
  /** A unique identifier for the cache */
  key: string;
  /** The time to live for the cache in seconds */
  ttl: number;
  /** An async function that returns an array of data */
  function: () => Promise<T[]>;
  /** The primary key the data are indexed by */
  primaryKey: keyof T;
};

type Entry<T> = {
  data: Record<string, T>;
  lastFetchTime: number;
};

/**
 * In-memory cache scoped to the current server instance (a Workers isolate or
 * a Node process). Concurrent misses share a single in-flight fetch.
 */
export class Cache<T> {
  constructor(options: Options<T>) {
    this.options = options;
  }

  private options: Options<T>;

  private entry: Entry<T> | undefined;

  private pending: Promise<Record<string, T>> | undefined;

  private async _refresh(): Promise<Record<string, T>> {
    console.log(`Cache "${this.options.key}" miss`);
    const data = this._toMap(await this.options.function());
    this.entry = { data, lastFetchTime: Date.now() };

    return data;
  }

  private _cachedRead(): Promise<Record<string, T>> {
    if (
      this.entry &&
      this.entry.lastFetchTime + this.options.ttl * 1000 > Date.now()
    ) {
      return Promise.resolve(this.entry.data);
    }

    this.pending ??= this._refresh().finally(() => {
      this.pending = undefined;
    });

    return this.pending;
  }

  private _toMap(data: T[]): Record<string, T> {
    return data.reduce(
      (acc, item) => {
        acc[`${this.options.key}-${item[this.options.primaryKey]}`] = item;
        return acc;
      },
      {} as Record<string, T>,
    );
  }

  public async get(): Promise<T[]> {
    return Object.values(await this._cachedRead());
  }

  public async getByPrimaryKey(primaryKey: string): Promise<T | undefined> {
    const data = await this._cachedRead();

    const cacheKey = `${this.options.key}-${primaryKey}`;

    if (!(cacheKey in data)) return;

    return data[cacheKey];
  }
}
