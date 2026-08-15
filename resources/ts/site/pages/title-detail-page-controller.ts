import { BasePageController } from './page-controller';
import { SectionSpy } from './section-spy';

export class TitleDetailPageController extends BasePageController
{
    private readonly sectionSpy: SectionSpy;

    public constructor(root: HTMLElement)
    {
        super(root);
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
