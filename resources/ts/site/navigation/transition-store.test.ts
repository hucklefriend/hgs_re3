import { describe, expect, it } from 'vitest';
import { TransitionStore } from './transition-store';

class MemoryStorage
{
    private readonly _values: Map<string, string> = new Map();

    public getItem(key: string): string | null
    {
        return this._values.get(key) ?? null;
    }

    public setItem(key: string, value: string): void
    {
        this._values.set(key, value);
    }

    public removeItem(key: string): void
    {
        this._values.delete(key);
    }
}

describe('TransitionStore', () => {
    it('returns and consumes a fresh matching transition', () => {
        const storage = new MemoryStorage();
        const store = new TransitionStore(storage);
        const record = {
            from: 'https://horrorgame.net/',
            to: 'https://horrorgame.net/game/lineup',
            startedAt: 10_000,
        };

        store.save(record);

        expect(store.consume(record.to, 12_000)).toEqual(record);
        expect(store.consume(record.to, 12_000)).toBeNull();
    });

    it('rejects an expired or future transition', () => {
        const expiredStorage = new MemoryStorage();
        const expiredStore = new TransitionStore(expiredStorage, 1_000);
        expiredStore.save({ from: 'https://horrorgame.net/', to: 'https://horrorgame.net/about', startedAt: 1_000 });
        expect(expiredStore.consume('https://horrorgame.net/about', 2_001)).toBeNull();

        const futureStorage = new MemoryStorage();
        const futureStore = new TransitionStore(futureStorage);
        futureStore.save({ from: 'https://horrorgame.net/', to: 'https://horrorgame.net/about', startedAt: 5_000 });
        expect(futureStore.consume('https://horrorgame.net/about', 4_999)).toBeNull();
    });

    it('rejects a stale record for another destination', () => {
        const storage = new MemoryStorage();
        const store = new TransitionStore(storage);
        store.save({ from: 'https://horrorgame.net/', to: 'https://horrorgame.net/about', startedAt: 1_000 });

        expect(store.consume('https://horrorgame.net/game/lineup', 2_000)).toBeNull();
    });
});
