// In-memory cache with TTL (Time To Live) for ultra-fast replies

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlSeconds = 600) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }
}

export const cache = new CacheService();
