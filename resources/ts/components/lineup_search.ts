import { Component } from "../component";

export class LineupSearch extends Component
{
    private _searchToggle: HTMLButtonElement | null = null;
    private _searchPanel: HTMLElement | null = null;
    private _searchInput: HTMLInputElement | null = null;
    private _boundSearchToggle: (() => void) | null = null;
    private _resetButton: HTMLButtonElement | null = null;
    private _boundReset: (() => void) | null = null;

    constructor()
    {
        super();

        this._searchToggle = document.getElementById('lineup-search-toggle') as HTMLButtonElement | null;
        this._searchPanel = document.getElementById('lineup-search-panel');
        this._searchInput = document.getElementById('search-input') as HTMLInputElement | null;
        this._resetButton = document.getElementById('search-reset-btn') as HTMLButtonElement | null;

        this.setupSearchPanel();
        this.setupReset();
    }

    dispose(): void
    {
        if (this._searchToggle && this._boundSearchToggle) {
            this._searchToggle.removeEventListener('click', this._boundSearchToggle);
        }
        if (this._resetButton && this._boundReset) {
            this._resetButton.removeEventListener('click', this._boundReset);
        }
    }

    private setupSearchPanel(): void
    {
        if (!this._searchToggle || !this._searchPanel) {
            return;
        }

        this._searchToggle.setAttribute('aria-expanded', String(!this._searchPanel.hidden));
        this._boundSearchToggle = () => {
            if (!this._searchPanel || !this._searchToggle) {
                return;
            }

            const opening = !this._searchPanel.classList.contains('is-open');
            this._searchToggle.setAttribute('aria-expanded', String(opening));

            if (opening) {
                this._searchPanel.hidden = false;
                requestAnimationFrame(() => {
                    this._searchPanel?.classList.add('is-open');
                    this._searchInput?.focus();
                });
                return;
            }

            this._searchPanel.classList.remove('is-open');
            const onTransitionEnd = (event: TransitionEvent): void => {
                const isPanelSizeTransition = event.propertyName === 'block-size' || event.propertyName === 'height';
                if (!isPanelSizeTransition || !this._searchPanel || this._searchPanel.classList.contains('is-open')) {
                    return;
                }

                this._searchPanel.hidden = true;
                this._searchPanel.removeEventListener('transitionend', onTransitionEnd);
            };
            this._searchPanel.addEventListener('transitionend', onTransitionEnd);
        };
        this._searchToggle.addEventListener('click', this._boundSearchToggle);
    }

    private setupReset(): void
    {
        if (!this._resetButton) {
            return;
        }

        this._boundReset = () => {
            const platformSelect = document.querySelector<HTMLSelectElement>('[name="platform_id"]');
            const fearMin = document.getElementById('fear-meter-min') as HTMLSelectElement | null;
            const fearMax = document.getElementById('fear-meter-max') as HTMLSelectElement | null;
            const releaseFrom = document.querySelector<HTMLInputElement>('[name="release_from"]');
            const releaseTo = document.querySelector<HTMLInputElement>('[name="release_to"]');

            if (this._searchInput) {
                this._searchInput.value = '';
            }
            if (platformSelect) {
                platformSelect.value = '0';
            }
            if (fearMin) {
                fearMin.value = '';
            }
            if (fearMax) {
                fearMax.value = '';
            }
            if (releaseFrom) {
                releaseFrom.value = '';
            }
            if (releaseTo) {
                releaseTo.value = '';
            }
        };
        this._resetButton.addEventListener('click', this._boundReset);
    }
}
