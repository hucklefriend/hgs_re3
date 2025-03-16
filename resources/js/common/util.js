import { Param } from "./param.js";
import { PointNode } from "../node/point-node.js";
import { OctaNode } from "../node/octa-node.js";
import { Vertex } from "./vertex.js";

export class Util
{
    /**
     * 2つの値の間を線形補間
     *
     * @param value1 開始値
     * @param value2 終了値
     * @param ratio 補間比率（0.0 から 1.0）
     * @param isFloor 結果を切り下げるかどうか
     * @returns {*}
     */
    static lerp(value1, value2, ratio, isFloor = false)
    {
        if (ratio <= 0) {
            return value1;
        } else if (ratio >= 1) {
            return value2;
        }

        const midpoint = value1 + (value2 - value1) * ratio;
        return isFloor ? Math.floor(midpoint) : midpoint;
    }

    /**
     * 指定された範囲内からランダムで1つの整数を返す関数
     * @param {number} min - 最小値（含む）
     * @param {number} max - 最大値（含む）
     * @returns {number} - ランダムな整数
     */
    static getRandomInt(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * エッジ用のJSON
     *
     * @param id
     * @param connects
     * @returns {*[]}
     */
    static getConnectJsonArr(id, connects)
    {
        let arr = [];
        connects.forEach(con => {
            if (con !== null && con.type === Param.CONNECT_TYPE_OUTGOING) {
                if (con.node instanceof OctaNode) {
                    arr.push({
                        from: id,
                        to: con.node.id,
                        to_vn: con.vertexNo,
                    });
                } else if (con.node instanceof PointNode) {
                    arr.push({
                        from: id,
                        to: con.node.id,
                    });
                }
            }
        });

        return arr;
    }

    /**
     * エッジの描画スタイルをセット
     * 
     * @param ctx
     */
    static setEdgeStyle(ctx)
    {
        ctx.strokeStyle = "rgba(0, 100, 0, 0.8)"; // 線の色と透明度
        ctx.lineWidth = 1; // 線の太さ
        ctx.shadowColor = "lime"; // 影の色
        ctx.shadowBlur = 5; // 影のぼかし効果
    }

    static getURLParams()
    {
        const params = {};
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    }

    /**
     * Vertexクラス配列をコピー
     * 
     * @param {Vertex[]} vertices 
     * @returns {Vertex[]}
     */
    static cloneVertices(vertices)
    {
        // Vertexクラス配列のコピーを作成
        const clonedVertices = [];
        for (let i = 0; i < vertices.length; i++) {
            clonedVertices.push(new Vertex(vertices[i].x, vertices[i].y));
        }
        return clonedVertices;
    }
}
