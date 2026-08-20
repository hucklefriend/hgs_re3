import type { Disposable } from '../core/disposable';
import type { DocumentPoint } from '../grid/grid-metrics';
import type { GridPlaneController } from '../grid/grid-plane-controller';
import type { LinkClassifier } from './link-classifier';

/**
 * 公開リンクの接続端子を生成し、グリッド行に近い位置へ補正する。
 */
export class ConnectionTerminalController implements Disposable
{
    private readonly _root: HTMLElement;
    private readonly _gridPlaneController: GridPlaneController;
    private readonly _linkClassifier: LinkClassifier;
    private readonly _terminals: Map<HTMLAnchorElement, HTMLElement> = new Map();
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

    public terminalFor(anchor: HTMLAnchorElement): HTMLElement
    {
        return this._terminals.get(anchor) ?? anchor;
    }

    public documentPointFor(anchor: HTMLAnchorElement): DocumentPoint
    {
        const element = this.terminalFor(anchor);
        const rect = element.getBoundingClientRect();

        return {
            x: rect.left + window.scrollX + (rect.width / 2),
            y: rect.top + window.scrollY + (rect.height / 2),
        };
    }

    public setConnecting(anchor: HTMLAnchorElement, connecting: boolean): void
    {
        const terminal = this._terminals.get(anchor);
        anchor.toggleAttribute('data-connection-selected', connecting);
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
