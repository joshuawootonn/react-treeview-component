export class MyMap<K, V> {
  map: Map<K, V>;
  constructor(map?: MyMap<K, V> | null);
  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(
    mapOrEntries?: MyMap<K, V> | readonly (readonly [K, V])[] | null
  ) {
    this.map =
      mapOrEntries instanceof MyMap
        ? new Map(mapOrEntries.map)
        : new Map(mapOrEntries);
  }
  toMap = (): Map<K, V> => {
    return new Map(Array.from(this.map.entries()));
  };
  get = (key: K): V | undefined => {
    return this.map.get(key);
  };
  set = (key: K, value: V): this => {
    this.map.set(key, value);
    return this;
  };

  delete = (key: K): this => {
    this.map.delete(key);
    return this;
  };
  toString = (): Record<any, V> => {
    return Object.fromEntries(this.map);
  };
  size = (): number => {
    return this.map.size;
  };
}
