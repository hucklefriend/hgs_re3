import type { MotionPreference } from '../core/motion-preference';
import { RevealingPageController } from './page-controller';
import { SectionSpy } from './section-spy';

export class TitleDetailPageController extends RevealingPageController
{
    private readonly sectionSpy: SectionSpy;

    public constructor(root: HTMLElement, motionPreference: MotionPreference)
    {
        super(root, motionPreference);
        this.sectionSpy = new SectionSpy(root);
    }

    protected startPage(): void
    {
        this.sectionSpy.start();
    }

    protected disposePage(): void
    {
        this.sectionSpy.dispose();
    }
}
