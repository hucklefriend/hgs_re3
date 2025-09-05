import { MainNodeBase } from "./main-node-base";
import { AppearStatus } from "../enum/appear-status";
import { Util } from "../common/util";
import { NodePoint } from "./parts/node-point";
import { Tree } from "../common/tree";
import { TreeOwnNodeType } from "../common/type";

export class TerminalNode extends MainNodeBase
{
    private _point: NodePoint;
    private _title: HTMLSpanElement;

    /**
     * コンストラクタ
     * @param nodeElement ノードの要素
     */
    public constructor(nodeElement: HTMLElement, parentNode: TreeOwnNodeType | null, parentTree: Tree)
    {
        super(nodeElement, parentNode, parentTree);

        this._point = new NodePoint(nodeElement.querySelector('.node-head .node-pt') as HTMLSpanElement);
        this._title = nodeElement.querySelector('.terminal-title') as HTMLSpanElement;
        
        // デバッグ用：ターミナルノードコンテナが存在するか確認
        const terminalContainer = nodeElement.querySelector('.terminal-node-container');
    }

    public get title(): string
    {
        return this._title.innerHTML;
    }

    protected isHover(): boolean
    {
        return this._appearStatus === AppearStatus.APPEARED && this._title.classList.contains('hover');
    }

    /**
     * アニメーションの更新処理
     */
    public update(): void
    {
        super.update();
    }
    
    /**
     * 接続点を取得する
     * @returns 接続点の座標
     */
    public getConnectionPoint(): {x: number, y: number}
    {
        return this._point.getCenterPosition();
    }

    /**
     * HTML上の絶対座標で接続点を取得する
     * @returns 絶対座標の接続点
     */
    public getAbsoluteConnectionPoint(): {x: number, y: number}
    {
        const rect = this._point.element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    public appearAnimation(): void
    {
        super.appearAnimation();

        if (this._curveAppearProgress === 1) {
            this._gradientEndAlpha = 1;
        }
    }
}
