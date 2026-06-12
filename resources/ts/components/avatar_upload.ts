import { Component } from "../component";

/**
 * アバター画像のアップロード・削除
 */
export class AvatarUpload extends Component
{
    private _fileInput: HTMLInputElement | null;
    private _preview: HTMLImageElement | null;
    private _saveArea: HTMLElement | null;
    private _saveBtn: HTMLButtonElement | null;
    private _cancelBtn: HTMLButtonElement | null;
    private _deleteBtn: HTMLButtonElement | null;
    private _message: HTMLElement | null;
    private _updateUrl: string;
    private _deleteUrl: string;
    private _originalSrc: string = '';
    private _pendingFile: File | null = null;

    private _fileChangeHandler: ((e: Event) => void) | null = null;
    private _saveHandler: (() => void) | null = null;
    private _cancelHandler: (() => void) | null = null;
    private _deleteHandler: (() => void) | null = null;

    constructor(params: any | null = null)
    {
        super(params);

        this._fileInput = document.getElementById('avatar-file-input') as HTMLInputElement | null;
        this._preview   = document.getElementById('avatar-preview') as HTMLImageElement | null;
        this._saveArea  = document.getElementById('avatar-save-area');
        this._saveBtn   = document.getElementById('avatar-save-btn') as HTMLButtonElement | null;
        this._cancelBtn = document.getElementById('avatar-cancel-btn') as HTMLButtonElement | null;
        this._deleteBtn = document.getElementById('avatar-delete-btn') as HTMLButtonElement | null;
        this._message   = document.getElementById('avatar-message');
        this._updateUrl = (document.getElementById('avatar-update-url') as HTMLInputElement | null)?.value || '';
        this._deleteUrl = (document.getElementById('avatar-delete-url') as HTMLInputElement | null)?.value || '';

        if (!this._fileInput || !this._preview) {
            return;
        }

        this._originalSrc = this._preview.src;

        this._fileChangeHandler = (e: Event) => this.onFileChange(e);
        this._saveHandler   = () => this.save();
        this._cancelHandler = () => this.cancel();
        this._deleteHandler = () => this.deleteAvatar();

        this._fileInput.addEventListener('change', this._fileChangeHandler);
        this._saveBtn?.addEventListener('click', this._saveHandler);
        this._cancelBtn?.addEventListener('click', this._cancelHandler);
        this._deleteBtn?.addEventListener('click', this._deleteHandler);
    }

    public dispose(): void
    {
        if (this._fileInput && this._fileChangeHandler) {
            this._fileInput.removeEventListener('change', this._fileChangeHandler);
        }
        this._saveBtn?.removeEventListener('click', this._saveHandler!);
        this._cancelBtn?.removeEventListener('click', this._cancelHandler!);
        this._deleteBtn?.removeEventListener('click', this._deleteHandler!);
    }

    private onFileChange(e: Event): void
    {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
            return;
        }

        this._pendingFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (this._preview && ev.target?.result) {
                this._preview.src = ev.target.result as string;
            }
        };
        reader.readAsDataURL(file);
        this._saveArea?.classList.remove('hidden');
        this.clearMessage();
    }

    private async save(): Promise<void>
    {
        if (!this._pendingFile || !this._saveBtn) {
            return;
        }

        this._saveBtn.disabled = true;
        this._saveBtn.textContent = '保存中...';
        this.clearMessage();

        const formData = new FormData();
        formData.append('avatar', this._pendingFile);
        formData.append('_token', (window as any).Laravel?.csrfToken || '');

        try {
            const response = await fetch(this._updateUrl, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                this.showMessage(data.message || '保存に失敗しました。', 'error');
                if (this._preview) {
                    this._preview.src = this._originalSrc;
                }
                return;
            }

            const data = await response.json();
            this._originalSrc = data.url;
            if (this._preview) {
                this._preview.src = data.url;
            }
            this._pendingFile = null;
            this._saveArea?.classList.add('hidden');
            this._deleteBtn?.classList.remove('hidden');
            if (this._fileInput) {
                this._fileInput.value = '';
            }
            this.showMessage('保存しました。', 'success');
        } catch {
            this.showMessage('保存に失敗しました。', 'error');
            if (this._preview) {
                this._preview.src = this._originalSrc;
            }
        } finally {
            if (this._saveBtn) {
                this._saveBtn.disabled = false;
                this._saveBtn.textContent = '保存する';
            }
        }
    }

    private cancel(): void
    {
        this._pendingFile = null;
        if (this._preview) {
            this._preview.src = this._originalSrc;
        }
        this._saveArea?.classList.add('hidden');
        if (this._fileInput) {
            this._fileInput.value = '';
        }
        this.clearMessage();
    }

    private async deleteAvatar(): Promise<void>
    {
        if (!this._deleteBtn || !confirm('アバターを削除してデフォルトに戻しますか？')) {
            return;
        }

        this._deleteBtn.disabled = true;
        this.clearMessage();

        try {
            const response = await fetch(this._deleteUrl, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': (window as any).Laravel?.csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                this.showMessage('削除に失敗しました。', 'error');
                return;
            }

            const data = await response.json();
            this._originalSrc = data.url;
            if (this._preview) {
                this._preview.src = data.url;
            }
            this._deleteBtn.classList.add('hidden');
            this.showMessage('削除しました。', 'success');
        } catch {
            this.showMessage('削除に失敗しました。', 'error');
        } finally {
            if (this._deleteBtn) {
                this._deleteBtn.disabled = false;
            }
        }
    }

    private showMessage(text: string, type: 'success' | 'error'): void
    {
        if (!this._message) {
            return;
        }
        this._message.textContent = text;
        this._message.className = `text-sm mt-2 ${type === 'success' ? 'text-green-400' : 'text-red-400'}`;
        this._message.classList.remove('hidden');
    }

    private clearMessage(): void
    {
        if (this._message) {
            this._message.textContent = '';
            this._message.classList.add('hidden');
        }
    }
}
