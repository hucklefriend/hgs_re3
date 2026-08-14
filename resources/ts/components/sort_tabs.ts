import { Component } from "../component";

/**
 * 並び順タブの現在位置を通常の文書URLから判定する。
 * ページ遷移はブラウザ標準に任せるため、旧Ajaxナビゲーションの完了待ちは不要。
 */
export class SortTabs extends Component
{
    private _handlers: Map<HTMLAnchorElement, () => void> = new Map();
    private _tabs: HTMLAnchorElement[] = [];

    constructor(params: any | null = null)
    {
        super(params);

        const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-sort-tabs]'));
        containers.forEach(container => {
            const anchors = Array.from(container.querySelectorAll<HTMLAnchorElement>('a'));
            anchors.forEach(anchor => {
                this._tabs.push(anchor);
                const handler = () => this.activate(anchor, anchors);
                anchor.addEventListener('click', handler);
                this._handlers.set(anchor, handler);
            });
        });
    }

    private activate(clicked: HTMLAnchorElement, tabs: HTMLAnchorElement[]): void
    {
        tabs.forEach(tab => tab.classList.remove('is-active'));
        clicked.classList.add('is-active');
    }

    public dispose(): void
    {
        this._handlers.forEach((handler, anchor) => {
            anchor.removeEventListener('click', handler);
        });
        this._handlers.clear();
        this._tabs = [];
    }
}
