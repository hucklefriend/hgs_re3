import { Component } from "../component";

type ActionMenuRecord = {
    root: HTMLElement;
    trigger: HTMLButtonElement;
    panel: HTMLElement;
    triggerClick: () => void;
    triggerKeydown: (event: KeyboardEvent) => void;
    panelClick: (event: MouseEvent) => void;
    panelKeydown: (event: KeyboardEvent) => void;
    focusout: (event: FocusEvent) => void;
    relationSuccess: (event: Event) => void;
};

type RelationSuccessDetail = {
    waitUntil: (promise: Promise<unknown>) => void;
};

const ACTION_SUCCESS_DURATION = 480;

/**
 * ユーザー一覧の行内操作メニュー。
 */
export class UserActionMenu extends Component
{
    private _records: ActionMenuRecord[] = [];
    private _openRecord: ActionMenuRecord | null = null;
    private _closeTimerIds: Set<number> = new Set();
    private _activeAnimations: Map<ActionMenuRecord, () => void> = new Map();

    private readonly _documentClick = (event: MouseEvent): void => {
        if (this._openRecord && !this._openRecord.root.contains(event.target as Node)) {
            this.close(this._openRecord);
        }
    };

    private readonly _documentKeydown = (event: KeyboardEvent): void => {
        if (event.key !== 'Escape' || !this._openRecord) {
            return;
        }

        event.preventDefault();
        const record = this._openRecord;
        this.close(record);
        record.trigger.focus();
    };

    private readonly _windowResize = (): void => {
        if (this._openRecord) {
            this.close(this._openRecord);
        }
    };

    constructor(params: any | null = null)
    {
        super(params);

        document.querySelectorAll<HTMLElement>('.js-user-action-menu').forEach(root => {
            const trigger = root.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]');
            const panel = root.querySelector<HTMLElement>('[role="menu"]');

            if (!trigger || !panel) {
                return;
            }

            const record = {} as ActionMenuRecord;
            record.root = root;
            record.trigger = trigger;
            record.panel = panel;
            record.triggerClick = () => this.toggle(record);
            record.triggerKeydown = event => this.handleTriggerKeydown(record, event);
            record.panelClick = event => this.handlePanelClick(record, event);
            record.panelKeydown = event => this.handlePanelKeydown(record, event);
            record.focusout = event => this.handleFocusout(record, event);
            record.relationSuccess = event => this.handleRelationSuccess(record, event);

            trigger.addEventListener('click', record.triggerClick);
            trigger.addEventListener('keydown', record.triggerKeydown);
            panel.addEventListener('click', record.panelClick);
            panel.addEventListener('keydown', record.panelKeydown);
            root.addEventListener('focusout', record.focusout);
            root.addEventListener('user-relation:success', record.relationSuccess);
            this._records.push(record);
        });

        document.addEventListener('click', this._documentClick);
        document.addEventListener('keydown', this._documentKeydown);
        window.addEventListener('resize', this._windowResize);
    }

    public dispose(): void
    {
        this._records.forEach(record => {
            record.trigger.removeEventListener('click', record.triggerClick);
            record.trigger.removeEventListener('keydown', record.triggerKeydown);
            record.panel.removeEventListener('click', record.panelClick);
            record.panel.removeEventListener('keydown', record.panelKeydown);
            record.root.removeEventListener('focusout', record.focusout);
            record.root.removeEventListener('user-relation:success', record.relationSuccess);
            this._activeAnimations.get(record)?.();
            this.close(record);
        });
        this._records = [];
        this._openRecord = null;
        this._closeTimerIds.forEach(timerId => window.clearTimeout(timerId));
        this._closeTimerIds.clear();

        document.removeEventListener('click', this._documentClick);
        document.removeEventListener('keydown', this._documentKeydown);
        window.removeEventListener('resize', this._windowResize);
    }

    private toggle(record: ActionMenuRecord): void
    {
        if (this._openRecord === record) {
            this.close(record);
            return;
        }

        this.open(record);
    }

    private open(record: ActionMenuRecord, focus: 'first' | 'last' | null = null): void
    {
        if (this._openRecord) {
            this.close(this._openRecord);
        }

        record.root.classList.remove('is-above');
        record.panel.hidden = false;
        record.root.classList.add('is-open');
        record.trigger.setAttribute('aria-expanded', 'true');
        this._openRecord = record;

        const panelRect = record.panel.getBoundingClientRect();
        const triggerRect = record.trigger.getBoundingClientRect();
        const fitsAbove = triggerRect.top - panelRect.height >= 12;
        if (panelRect.bottom > window.innerHeight - 12 && fitsAbove) {
            record.root.classList.add('is-above');
        }

        if (focus) {
            const items = this.getItems(record);
            const item = focus === 'first' ? items[0] : items[items.length - 1];
            item?.focus();
        }
    }

    private close(record: ActionMenuRecord): void
    {
        record.panel.hidden = true;
        record.root.classList.remove('is-open', 'is-above');
        record.trigger.setAttribute('aria-expanded', 'false');

        if (this._openRecord === record) {
            this._openRecord = null;
        }
    }

    private handleTriggerKeydown(record: ActionMenuRecord, event: KeyboardEvent): void
    {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
            return;
        }

        event.preventDefault();
        this.open(record, event.key === 'ArrowDown' ? 'first' : 'last');
    }

    private handlePanelClick(record: ActionMenuRecord, event: MouseEvent): void
    {
        const target = event.target as Element;
        const item = target.closest<HTMLElement>('[role="menuitem"]');
        if (!item) {
            return;
        }

        if (item instanceof HTMLAnchorElement) {
            const timerId = window.setTimeout(() => {
                this._closeTimerIds.delete(timerId);
                this.close(record);
            }, 0);
            this._closeTimerIds.add(timerId);
            return;
        }

        this.close(record);
    }

    private handlePanelKeydown(record: ActionMenuRecord, event: KeyboardEvent): void
    {
        const items = this.getItems(record);
        if (items.length === 0) {
            return;
        }

        const currentIndex = items.indexOf(document.activeElement as HTMLElement);
        let nextIndex: number | null = null;

        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % items.length;
        } else if (event.key === 'ArrowUp') {
            nextIndex = (currentIndex - 1 + items.length) % items.length;
        } else if (event.key === 'Home') {
            nextIndex = 0;
        } else if (event.key === 'End') {
            nextIndex = items.length - 1;
        }

        if (nextIndex === null) {
            return;
        }

        event.preventDefault();
        items[nextIndex]?.focus();
    }

    private handleFocusout(record: ActionMenuRecord, event: FocusEvent): void
    {
        const nextTarget = event.relatedTarget;
        if (this._openRecord === record
            && (!(nextTarget instanceof Node) || !record.root.contains(nextTarget))) {
            this.close(record);
        }
    }

    private handleRelationSuccess(record: ActionMenuRecord, event: Event): void
    {
        if (!(event instanceof CustomEvent)) {
            return;
        }

        const detail = event.detail as RelationSuccessDetail | undefined;
        if (typeof detail?.waitUntil !== 'function') {
            return;
        }

        detail.waitUntil(this.playSuccessAnimation(record));
    }

    private playSuccessAnimation(record: ActionMenuRecord): Promise<void>
    {
        this._activeAnimations.get(record)?.();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return Promise.resolve();
        }

        record.trigger.removeAttribute('data-action-complete');
        void record.trigger.offsetWidth;
        record.trigger.setAttribute('data-action-complete', '');

        return new Promise(resolve => {
            let timerId = 0;
            const finish = (): void => {
                if (timerId !== 0) {
                    window.clearTimeout(timerId);
                }
                record.trigger.removeAttribute('data-action-complete');
                this._activeAnimations.delete(record);
                resolve();
            };

            timerId = window.setTimeout(finish, ACTION_SUCCESS_DURATION);
            this._activeAnimations.set(record, finish);
        });
    }

    private getItems(record: ActionMenuRecord): HTMLElement[]
    {
        return Array.from(record.panel.querySelectorAll<HTMLElement>('[role="menuitem"]'))
            .filter(item => !item.hasAttribute('disabled'));
    }
}
