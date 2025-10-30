
export class NextNodeCache
{
    public title: string;
    public currentNodeTitle: string;
    public currentNodeContent: string;
    public nodes: string;
    public popup: string;
    public url: string;
    public hasError: boolean;

    public constructor()
    {
        this.title = '';
        this.currentNodeTitle = '';
        this.currentNodeContent = '';
        this.nodes = '';
        this.popup = '';
        this.url = '';
        this.hasError = false;
    }
}