import { Component } from "../component";

type RelationSuccessDetail = {
    waitUntil: (promise: Promise<unknown>) => void;
};

/**
 * フォロー・ブロック・ミュートのトグルボタン
 *
 * Blade 側で以下のデータ属性を設定する:
 *   data-active="0|1"          現在の状態（1=ON）
 *   data-label-on              ON 状態のラベル（textContent または title に使用）
 *   data-label-off             OFF 状態のラベル（textContent または title に使用）
 *   data-url-on                ON→OFF にする API URL
 *   data-url-off               OFF→ON にする API URL
 *   data-method-on             ON→OFF のHTTPメソッド（DELETE等）
 *   data-method-off            OFF→ON のHTTPメソッド（POST等）
 *   data-reload="1"            （省略可）操作後にページをリロードする
 *   data-confirm                （省略可）実行前に表示する確認文
 *   data-icon-on               （省略可）ON 状態の <i> クラス文字列（設定するとアイコンモードになる）
 *   data-icon-off              （省略可）OFF 状態の <i> クラス文字列
 */
export class UserRelation extends Component
{
    private _handlers: Map<HTMLButtonElement, (event: MouseEvent) => void> = new Map();

    constructor(params: any | null = null)
    {
        super(params);

        const buttons = Array.from(
            document.querySelectorAll<HTMLButtonElement>('.js-follow-toggle, .js-block-toggle, .js-mute-toggle')
        );

        buttons.forEach(btn => {
            const handler = (event: MouseEvent) => this.handleClick(btn, event);
            btn.addEventListener('click', handler);
            this._handlers.set(btn, handler);
        });
    }

    public dispose(): void
    {
        this._handlers.forEach((handler, btn) => {
            btn.removeEventListener('click', handler);
        });
        this._handlers.clear();
    }

    private async handleClick(btn: HTMLButtonElement, event: MouseEvent): Promise<void>
    {
        if (btn.disabled) {
            return;
        }

        const confirmation = btn.dataset.confirm;
        if (confirmation && !window.confirm(confirmation)) {
            event.stopPropagation();
            return;
        }

        const isActive  = btn.dataset.active === '1';
        const url       = isActive ? (btn.dataset.urlOn || '') : (btn.dataset.urlOff || '');
        const method    = isActive ? (btn.dataset.methodOn || 'DELETE') : (btn.dataset.methodOff || 'POST');
        const labelOn   = btn.dataset.labelOn || '';
        const labelOff  = btn.dataset.labelOff || '';
        const reload    = btn.dataset.reload === '1';

        if (!url) {
            return;
        }

        btn.disabled = true;
        const prevText = btn.textContent || '';
        let reloading = false;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'X-CSRF-TOKEN': (window as any).Laravel?.csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                alert(data.message || '操作に失敗しました。');
                return;
            }

            const nextActive = !isActive;
            if (!reload) {
                btn.dataset.active = nextActive ? '1' : '0';

                const iconEl = btn.querySelector<HTMLElement>('i');
                if (iconEl && btn.dataset.iconOn && btn.dataset.iconOff) {
                    iconEl.className = nextActive ? btn.dataset.iconOn : btn.dataset.iconOff;
                    btn.title = nextActive ? labelOn : labelOff;
                } else {
                    btn.textContent = nextActive ? labelOn : labelOff;
                }
            }

            await this.waitForSuccessEffects(btn);

            if (reload) {
                reloading = true;
                location.reload();
            }
        } catch {
            alert('操作に失敗しました。');
            btn.textContent = prevText;
        } finally {
            if (!reloading) {
                btn.disabled = false;
            }
        }
    }

    private async waitForSuccessEffects(btn: HTMLButtonElement): Promise<void>
    {
        const pendingEffects: Promise<unknown>[] = [];
        const event = new CustomEvent<RelationSuccessDetail>('user-relation:success', {
            bubbles: true,
            detail: {
                waitUntil: promise => pendingEffects.push(promise),
            },
        });
        btn.dispatchEvent(event);

        if (pendingEffects.length > 0) {
            await Promise.allSettled(pendingEffects);
        }
    }
}
