import { redis } from "./redis";

export type CacheKeyBuilder = (...args: any[]) => string;

export interface CacheableRegisterOptions {
	key?: string | CacheKeyBuilder;
	namespace?: string | CacheKeyBuilder;
	ttl?: number;
}
export type CacheEvictKeyBuilder = (...args: any[]) => string | string[];
export interface CacheEvictRegisterOptions {
	key?: string | CacheEvictKeyBuilder;
	namespace?: string | CacheKeyBuilder;
}

type KeyType = string | string[] | CacheKeyBuilder | CacheEvictKeyBuilder;
/**
 * try extract valid key from build function or fixed string
 */
function extract(keyBuilder: KeyType, args: any[]): string[] {
	const keys =
		keyBuilder instanceof Function ? keyBuilder(...args) : keyBuilder;
	return Array.isArray(keys) ? keys : [keys];
}

/**
 * generateComposedKey
 * generate the final cache key, compose of use key and namespace(option), like 'namespace:key'
 */
export function generateComposedKey(options: {
	key: string | CacheKeyBuilder | CacheEvictKeyBuilder;
	namespace?: string | CacheKeyBuilder;
	args: any[];
}): string[] {
	let keys: string[];
	keys = extract(options.key, options.args);
	const namespace =
		options.namespace && extract(options.namespace, options.args);
	return keys.map((it) => (namespace ? `${namespace[0]}:${it}` : it));
}

const pendingCacheMap = new Map<string, Promise<any>>();
async function fetchCachedValue(key: string) {
	let pendingCachePromise = pendingCacheMap.get(key);
	if (!pendingCachePromise) {
		pendingCachePromise = redis.get(key);
		pendingCacheMap.set(key, pendingCachePromise);
	}
	let value;
	try {
		value = await pendingCachePromise;
	} catch (e) {
		throw e;
	} finally {
		pendingCacheMap.delete(key);
	}
	return value;
}

const pendingMethodCallMap = new Map<string, Promise<any>>();
async function fetchCachedMethodCall(
	key: string,
	method: () => Promise<any>,
	ttl?: number
) {
	try {
		const cachedValue = await fetchCachedValue(key);
		if (cachedValue !== undefined && cachedValue !== null) return cachedValue;
	} catch { }
	let pendingMethodCallPromise = pendingMethodCallMap.get(key);
	if (!pendingMethodCallPromise) {
		pendingMethodCallPromise = method();
		pendingMethodCallMap.set(key, pendingMethodCallPromise);
	}
	let value;
	try {
		value = await pendingMethodCallPromise;
	} catch (e) {
		throw e;
	} finally {
		pendingMethodCallMap.delete(key);
	}
	if (ttl) {
		await redis.set(key, value, "EX", ttl);
	} else {
		await redis.set(key, value);
	}
	return value;
}

function cacheable<T>(key: string | CacheKeyBuilder, method: (...args: any[]) => Promise<T>) {

}
