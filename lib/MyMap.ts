type MyMapType<V> = { count: number; value: V };

export class MyMap<K, V> {
  map: Map<K, MyMapType<V>>;
  constructor(map?: MyMap<K, V> | null);
  constructor(entries?: readonly (readonly [K, V])[] | null);
  constructor(
    mapOrEntries?: MyMap<K, V> | readonly (readonly [K, V])[] | null
  ) {
    this.map =
      mapOrEntries instanceof MyMap
        ? new Map(mapOrEntries.map)
        : new Map(
            mapOrEntries?.map(([key, value]) => [key, { count: 1, value }])
          );
  }
  toMap = (): Map<K, V> => {
    return new Map(
      Array.from(this.map.entries()).map(([key, { value }]) => [key, value])
    );
  };
  get = (key: K): V | undefined => {
    return this.map.get(key)?.value;
  };
  set = (key: K, value: V): this => {
    const existing = this.map.get(key);
    this.map.set(key, { count: (existing?.count ?? 0) + 1, value });
    return this;
  };
  replace = (key: K, value: V): this => {
    const existing = this.map.get(key);
    this.map.set(key, { count: existing?.count ?? 1, value });
    return this;
  };
  delete = (key: K): boolean => {
    if (!this.map.has(key)) return false;
    const existing = this.map.get(key)!;
    if (existing.count === 1) return this.map.delete(key);
    this.map.set(key, { ...existing, count: existing.count - 1 });
    return true;
  };
  toString = (): Record<any, V> => {
    return Object.fromEntries(this.map);
  };
  size = (): number => {
    return this.map.size;
  };
}
