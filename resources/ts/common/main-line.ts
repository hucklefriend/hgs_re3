export class MainLine
{
    private element: HTMLDivElement;
    private height: number;
    private animationHeight: number;
    private animationStartTime: number;
    private appearAnimationFunc: (() => void) | null;

    /**
     * コンストラクタ
     */
    public constructor(element: HTMLDivElement)
    {
        this.element = element;
        this.height = 0;
        this.animationHeight = 0;
        this.animationStartTime = 0;
        this.appearAnimationFunc = null;
    }

    /**
     * 高さを設定
     * 
     * @param height 高さ
     */
    public setHeight(height: number): void
    {
        //this.element.style.height = `${height}px`;
        this.height = height;
    }

    public getAnimationHeight(): number
    {
        return this.animationHeight;
    }

    public update(): void
    {
        if (this.appearAnimationFunc) {
            this.appearAnimationFunc();
        }
    }

    public appear(): void
    {
        this.animationStartTime = (window as any).hgn.timestamp;
        this.appearAnimationFunc = this.appearAnimation;
    }

    private appearAnimation(): void
    {
        const progress = (window as any).hgn.timestamp - this.animationStartTime;
        this.animationHeight = this.height * progress / 1000;

        if (this.animationHeight >= this.height) {
            this.animationHeight = this.height;
            this.appearAnimationFunc = null;
        }

        this.element.style.height = `${this.animationHeight}px`;
    }

    public disappear(): void
    {
        this.element.style.visibility = 'hidden';
        this.animationStartTime = (window as any).hgn.timestamp;
        this.appearAnimationFunc = this.disappearAnimation;
    }

    private disappearAnimation(): void
    {
        const progress = (window as any).hgn.timestamp - this.animationStartTime;
        this.animationHeight = this.height * (1 - progress / 300);

        if (this.animationHeight <= 0) {
            this.animationHeight = 0;
            this.appearAnimationFunc = null;
        }

        this.element.style.height = `${this.animationHeight}px`;
    }

    public isAppeared(): boolean
    {
        return this.animationHeight >= this.height;
    }
} 