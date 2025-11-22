import { Component } from "../component";

/**
 * タイトル詳細画面のお気に入りトグル機能
 */
export class TitleDetailFavorite extends Component
{
    private _form: HTMLFormElement | null = null;
    private _submitButton: HTMLButtonElement | null = null;
    private _isProcessing: boolean = false;

    /**
     * コンストラクタ
     * @param params 初期化パラメーター（未使用）
     */
    constructor(params: any | null = null)
    {
        super(params);
        
        // DOM要素を取得
        this._form = document.querySelector('.favorite-toggle-form') as HTMLFormElement;
        if (!this._form) {
            return;
        }
        
        // フォームのsubmitイベントをバインド
        this._form.addEventListener('submit', (e: SubmitEvent) => this.submit(e));
        this._submitButton = this._form.querySelector('button[type="submit"]') as HTMLButtonElement;
    }

    /**
     * お気に入りの状態に応じたtitle属性の値を取得
     * @param isFavorite お気に入り登録済みかどうか
     * @returns title属性の値
     */
    private getTitleText(isFavorite: boolean): string
    {
        return isFavorite ? 'お気に入りを解除' : 'お気に入りに登録';
    }

    /**
     * ボタンの表示とtitle属性を更新
     * @param isFavorite お気に入り登録済みかどうか
     */
    private updateButtonDisplay(isFavorite: boolean): void
    {
        if (!this._submitButton) {
            return;
        }
        this._submitButton.textContent = isFavorite ? '★' : '☆';
        this._submitButton.title = this.getTitleText(isFavorite);
        
        // クラスの追加/削除で枠線の色を切り替え
        if (isFavorite) {
            this._submitButton.classList.add('is-favorite');
        } else {
            this._submitButton.classList.remove('is-favorite');
        }
    }

    /**
     * フォームのsubmitイベントハンドラ
     */
    private async submit(e: SubmitEvent): Promise<void>
    {
        e.preventDefault();
        
        // 要素が存在しない、または処理中なら何もしない
        if (!this._form || !this._submitButton || this._isProcessing) {
            return;
        }

        this._isProcessing = true;
        const currentText = this._submitButton.textContent?.trim() || '';
        const isCurrentlyFavorite = currentText === '★';
        const currentTitle = this._submitButton.title;
        const wasFavorite = this._submitButton.classList.contains('is-favorite');
        
        // 即座に表示を切り替え
        this.updateButtonDisplay(!isCurrentlyFavorite);

        try {
            const response = await fetch(this._form.action, {
                method: this._form.method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(Object.fromEntries(new FormData(this._form)))
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            // レスポンスのステータスに応じて表示を確定
            if (data.status === 1) {
                // 登録された
                this.updateButtonDisplay(true);
            } else if (data.status === 2) {
                // 解除された
                this.updateButtonDisplay(false);
            } else {
                // 予期しないステータスの場合は元に戻す
                this._submitButton.textContent = currentText;
                this._submitButton.title = currentTitle;
                if (wasFavorite) {
                    this._submitButton.classList.add('is-favorite');
                } else {
                    this._submitButton.classList.remove('is-favorite');
                }
                throw new Error('Unexpected status');
            }
        } catch (error) {
            // エラー時は元の表示に戻す
            this._submitButton.textContent = currentText;
            this._submitButton.title = currentTitle;
            if (wasFavorite) {
                this._submitButton.classList.add('is-favorite');
            } else {
                this._submitButton.classList.remove('is-favorite');
            }
            alert('お気に入りの登録・解除に失敗しました。');
        } finally {
            // 連打防止のため0.5秒待機
            await new Promise(resolve => setTimeout(resolve, 500));
            this._isProcessing = false;
        }
    }
}

