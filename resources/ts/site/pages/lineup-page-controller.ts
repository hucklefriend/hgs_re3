import { ConsoleTabs } from './console-tabs';
import { BasePageController } from './page-controller';

export class LineupPageController extends BasePageController
{
    private readonly consoleTabs: ConsoleTabs;

    public constructor(root: HTMLElement)
    {
        super(root);
        this.consoleTabs = new ConsoleTabs(root);
    }

    protected startPage(): void
    {
        this.consoleTabs.start();
    }

    protected disposePage(): void
    {
        this.consoleTabs.dispose();
    }
}
