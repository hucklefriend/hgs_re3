import { NodePoint } from "./node-point";
import { Point } from "../../common/point";
import { AppearStatus } from "../../enum/appear-status";
import { Util } from "../../common/util";
import { NodeHead } from "./node-head";
import { ClickableNodeInterface } from "../interface/clickable-node-interface";

export class NodeHeadClickable extends NodeHead
{
    private _parentNode: ClickableNodeInterface;


    /**
     * コンストラクタ
     */
    public constructor(nodeElement: HTMLElement, parentNode: ClickableNodeInterface)
    {
        super(nodeElement);

        this._parentNode = parentNode;

        this._nodeElement.addEventListener('click', this.click.bind(this));
        this._nodeElement.addEventListener('mouseenter', this.hover.bind(this));
        this._nodeElement.addEventListener('mouseleave', this.unhover.bind(this));
    }

    public isHover(): boolean
    {
        return this._nodeElement.classList.contains('hover');
    }

    public hover(): void
    {
        if (!AppearStatus.isAppeared(this._parentNode.appearStatus)) {
            return;
        }

        this._nodeElement.classList.add('hover');
        this._parentNode.hover();
    }

    public unhover(): void
    {
        if (!AppearStatus.isAppeared(this._parentNode.appearStatus)) {
            return;
        }
        
        this._nodeElement.classList.remove('hover');
        this._parentNode.unhover();
    }

    public click(e: MouseEvent): void
    {
        e.preventDefault();

        if (!AppearStatus.isAppeared(this._parentNode.appearStatus)) {
            return;
        }

        this._parentNode.click(e);
    }
}
