

export class NormalLink
{
    constructor(DOM)
    {
        this.DOM = DOM;
        this.DOM.addEventListener('click', this.onClick.bind(this));
    }

    delete()
    {
        this.DOM.removeEventListener('click', this.onClick.bind(this));
        this.DOM = null;
    }

    onClick(event)
    {
        if (!this.DOM.dataset.hasOwnProperty('type')) {
            return true;
        }

        event.preventDefault();

        const type = this.DOM.dataset.type;
        switch (type) {
            case 'doc':
                window.hgn.navigateToDocument(this.DOM.href);
                break;
            case 'map':
                window.hgn.navigateToMap(this.DOM.href);
                break;
            default:
                event.preventDefault();
                break;
        }

        return false;
    }
}