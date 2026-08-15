import type { Disposable } from '../core/disposable';

export interface PageController extends Disposable
{
    start(): void;
}

export abstract class BasePageController implements PageController
{
    protected readonly root: HTMLElement;
    private started: boolean = false;

    protected constructor(root: HTMLElement)
    {
        this.root = root;
    }

    public start(): void
    {
        if (this.started) {
            return;
        }

        this.started = true;
        this.startPage();
    }

    public dispose(): void
    {
        if (!this.started) {
            return;
        }

        this.disposePage();
        this.started = false;
    }

    protected startPage(): void
    {
    }

    protected disposePage(): void
    {
    }

}
