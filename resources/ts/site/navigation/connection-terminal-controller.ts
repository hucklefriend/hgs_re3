import type { Disposable } from '../core/disposable';
import type { DocumentPoint } from '../grid/grid-metrics';
import type { GridPlaneController } from '../grid/grid-plane-controller';
import type { LinkClassifier } from './link-classifier';

/**
 * 公開リンクの接続端子を生成し、明示された操作要素を含めて位置を管理する。
 */
export class ConnectionTerminalController implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _linkClassifier: LinkClassifier;
    private readonly _terminals: Map<HTMLElement, HTMLElement> = new Map();
    private readonly _generatedTerminals: Set<HTMLElement> = new Set();
    private _removeMetricsListener: (() => void) | null = null;
    private _started: boolean = false;

    public constructor(
        root: HTMLElement,
        gridPlaneController: GridPlaneController,
        linkClassifier: LinkClassifier,
    ) {
        this._root = root;
        this._gridPlaneController = gridPlaneController;
        this._linkClassifier = linkClassifier;
    }

    public start(): void
    {
        if (this._started) {
            return;
        }

        this._started = true;
        this.collectTerminals();
        this._removeMetricsListener = this._gridPlaneController.onMetricsChange(this.syncPositions);
        this.syncPositions();
    }

    public terminalFor(owner: HTMLElement): HTMLElement
    {
        return this._terminals.get(owner) ?? owner;
    }

    public documentPointFor(owner: HTMLElement): DocumentPoint
    {
        const element = this.terminalFor(owner);
        const rect = element.getBoundingClientRect();

        return {
            x: rect.left + window.scrollX + (rect.width / 2),
            y: rect.top + window.scrollY + (rect.height / 2),
        };
    }

    public setConnecting(owner: HTMLElement, connecting: boolean): void
    {
        const terminal = this._terminals.get(owner);
        owner.toggleAttribute('data-connection-selected', connecting);
        terminal?.toggleAttribute('data-connecting', connecting);
    }

    public reset(): void
    {
        this._terminals.forEach((terminal, anchor) => {
            anchor.removeAttribute('data-connection-selected');
            terminal.removeAttribute('data-connecting');
        });
    }

    public dispose(): void
    {
        if (!this._started) {
            return;
        }

        this.reset();
        this._removeMetricsListener?.();
        this._removeMetricsListener = null;
        this._generatedTerminals.forEach((terminal) => terminal.remove());
        this._generatedTerminals.clear();
        this._terminals.forEach((_terminal, anchor) => anchor.classList.remove('has-site-connection-terminal'));
        this._terminals.clear();
        this._started = false;
    }

    private collectTerminals(): void
    {
        this._root.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
            if (anchor.hasAttribute('data-no-connection-terminal') || !this._linkClassifier.destinationForAnchor(anchor)) {
                return;
            }

            let terminal = anchor.querySelector<HTMLElement>(':scope > [data-connection-terminal]');
            if (!terminal) {
                terminal = anchor.ownerDocument.createElement('span');
                terminal.className = 'site-connection-terminal';
                terminal.dataset.connectionTerminal = '';
                terminal.setAttribute('aria-hidden', 'true');
                anchor.append(terminal);
                this._generatedTerminals.add(terminal);
            }

            anchor.classList.add('has-site-connection-terminal');
            this._terminals.set(anchor, terminal);
        });

        this._root.querySelectorAll<HTMLElement>('[data-connection-terminal]').forEach((terminal) => {
            const owner = terminal.parentElement;
            if (owner === null || terminal !== owner.querySelector(':scope > [data-connection-terminal]')) {
                return;
            }

            owner.classList.add('has-site-connection-terminal');
            this._terminals.set(owner, terminal);
        });
    }

    private readonly syncPositions = (): void =>
    {
        this._terminals.forEach((terminal, anchor) => {
            const rect = anchor.getBoundingClientRect();
            const centerY = rect.height / 2;

            terminal.style.setProperty('--site-terminal-y', `${centerY}px`);
        });
    };
}
