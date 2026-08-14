import type { MotionPreference } from '../core/motion-preference';
import { ConsoleTabs } from './console-tabs';
import { RevealingPageController } from './page-controller';

export class LineupPageController extends RevealingPageController
{
    private readonly consoleTabs: ConsoleTabs;

    public constructor(root: HTMLElement, motionPreference: MotionPreference)
    {
        super(root, motionPreference);
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
