import { GridMetrics, type DocumentPoint } from '../grid/grid-metrics';

/**
 * 接続端子からヘッダー常設ノードまで、直交線分だけの経路を生成する。
 */
export class HandoffRoutePlanner
{
    public plan(origin: DocumentPoint, metrics: GridMetrics): DocumentPoint[]
    {
        const entry = metrics.snapToIntersection(origin);
        const destination = metrics.getHeaderArrivalPoint();

        return this.compact([
            origin,
            { x: entry.x, y: origin.y },
            { x: entry.x, y: destination.y },
            destination,
        ]);
    }

    private compact(points: DocumentPoint[]): DocumentPoint[]
    {
        return points.filter((point, index) => {
            if (index === 0) {
                return true;
            }

            const previous = points[index - 1];

            return point.x !== previous.x || point.y !== previous.y;
        });
    }
}
