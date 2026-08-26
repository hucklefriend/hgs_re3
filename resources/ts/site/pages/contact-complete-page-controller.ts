import type { GridPlaneController } from '../grid/grid-plane-controller';
import { StandardPageController } from './standard-page-controller';

export class ContactCompletePageController extends StandardPageController
{
    private readonly confirmationUrl: string | null;

    public constructor(
        root: HTMLElement,
        gridPlaneController: GridPlaneController,
    ) {
        super(root, gridPlaneController);
        this.confirmationUrl = root
            .querySelector<HTMLElement>('[data-contact-confirmation-url]')
            ?.dataset.contactConfirmationUrl ?? null;
    }

    protected startPage(): void
    {
        super.startPage();
        window.queueMicrotask(this.replaceHistoryUrl);
    }

    private readonly replaceHistoryUrl = (): void =>
    {
        if (this.confirmationUrl === null) {
            return;
        }

        try {
            const destination = new URL(this.confirmationUrl, window.location.href);
            if (destination.origin !== window.location.origin) {
                return;
            }

            window.history.replaceState(window.history.state, '', destination.href);
        } catch {
            // URLを書き換えられない場合も、送信完了画面の表示は維持する。
        }
    };
}
