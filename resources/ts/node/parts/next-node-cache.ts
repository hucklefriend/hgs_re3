
export class NextNodeCache
{
    public title: string;
    public currentTitle: string;
    public currentContent: string;
    public nodes: string;
    public popup: string;
    public ratingCheck: boolean;

    public constructor()
    {
        this.title = '';
        this.currentTitle = '';
        this.currentContent = '';
        this.nodes = '';
        this.popup = '';
        this.ratingCheck = false;
    }
}