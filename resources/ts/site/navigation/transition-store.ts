export interface TransitionRecord
{
    from: string;
    to: string;
    startedAt: number;
}

interface StorageLike
{
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

const STORAGE_KEY = 'hgn-public-page-transition';
const DEFAULT_MAXIMUM_AGE = 15_000;

/**
 * 全文書遷移をまたいで最小限の接続情報だけを引き渡す。
 */
export class TransitionStore
{
    public constructor(
        private readonly _storage: StorageLike | null,
        private readonly _maximumAge: number = DEFAULT_MAXIMUM_AGE,
    ) {}

    public save(record: TransitionRecord): void
    {
        if (!this._storage) {
            return;
        }

        try {
            this._storage.setItem(STORAGE_KEY, JSON.stringify(record));
        } catch {
            // 演出はストレージを必須としない。
        }
    }

    public consume(currentUrl: string, now: number = Date.now()): TransitionRecord | null
    {
        if (!this._storage) {
            return null;
        }

        let raw: string | null = null;

        try {
            raw = this._storage.getItem(STORAGE_KEY);
            this._storage.removeItem(STORAGE_KEY);
        } catch {
            return null;
        }

        if (!raw) {
            return null;
        }

        try {
            const record = JSON.parse(raw) as TransitionRecord;
            if (!this.isValid(record, currentUrl, now)) {
                return null;
            }

            return record;
        } catch {
            return null;
        }
    }

    public clear(): void
    {
        if (!this._storage) {
            return;
        }

        try {
            this._storage.removeItem(STORAGE_KEY);
        } catch {
            // UI状態はストレージ削除の成否に依存しない。
        }
    }

    private isValid(record: TransitionRecord, currentUrl: string, now: number): boolean
    {
        if (typeof record.from !== 'string'
            || typeof record.to !== 'string'
            || !Number.isFinite(record.startedAt)) {
            return false;
        }

        if (record.startedAt > now || now - record.startedAt > this._maximumAge) {
            return false;
        }

        try {
            const expected = new URL(record.to);
            const current = new URL(currentUrl);

            return expected.origin === current.origin
                && expected.pathname === current.pathname
                && expected.search === current.search
                && expected.hash === current.hash;
        } catch {
            return false;
        }
    }
}
