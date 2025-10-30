import { AppearStatus } from "../../enum/appear-status";
import { NodeHeadClickable } from "../parts/node-head-clickable";

/**
 * クリック可能なヘッダを持つノードのインターフェース
 */
export interface ClickableNodeInterface
{
    readonly appearStatus: AppearStatus;
    readonly nodeHead: NodeHeadClickable;

    hover(): void;
    unhover(): void;
    click(e: MouseEvent): void;
}