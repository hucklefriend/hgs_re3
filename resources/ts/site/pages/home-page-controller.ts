import type { MotionPreference } from '../core/motion-preference';
import { RevealingPageController } from './page-controller';

export class HomePageController extends RevealingPageController
{
    public constructor(root: HTMLElement, motionPreference: MotionPreference)
    {
        super(root, motionPreference);
    }
}
