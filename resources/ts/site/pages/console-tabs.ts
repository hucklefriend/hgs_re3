import type { Disposable } from '../core/disposable';

export class ConsoleTabs implements Disposable
{
    private readonly root: HTMLElement;
    private readonly controls: HTMLElement[];
    private readonly panels: HTMLElement[];
    private readonly handlers: Map<HTMLElement, () => void> = new Map();

    public constructor(root: HTMLElement)
    {
        this.root = root;
        this.controls = Array.from(root.querySelectorAll<HTMLElement>('[data-console-control]'));
        this.panels = Array.from(root.querySelectorAll<HTMLElement>('[data-console-panel]'));
    }

    public start(): void
    {
        if (this.controls.length === 0 || this.panels.length === 0) {
            return;
        }

        this.controls.forEach((control) => {
            const handler = (): void => {
                const target = control.dataset.consoleControl;
                if (target) {
                    this.select(target);
                }
            };
            control.addEventListener('click', handler);
            this.handlers.set(control, handler);
        });

        const initial = this.controls.find((control) => control.classList.contains('is-active'))
            ?? this.controls[0];
        const target = initial.dataset.consoleControl;
        if (target) {
            this.select(target);
        }
    }

    public dispose(): void
    {
        this.handlers.forEach((handler, control) => control.removeEventListener('click', handler));
        this.handlers.clear();
    }

    private select(target: string): void
    {
        this.controls.forEach((control) => {
            const selected = control.dataset.consoleControl === target;
            control.classList.toggle('is-active', selected);
            control.setAttribute('aria-pressed', String(selected));
        });

        this.panels.forEach((panel) => {
            const selected = panel.dataset.consolePanel === target;
            panel.hidden = !selected;
            panel.classList.toggle('is-active', selected);
        });

        this.root.dispatchEvent(new CustomEvent('site:console-tab-change', {
            detail: { target },
        }));
    }
}
