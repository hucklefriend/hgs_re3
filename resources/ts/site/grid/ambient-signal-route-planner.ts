import type { GridPoint } from './grid-metrics';

export type AmbientSignalDirection = 'right' | 'left' | 'down' | 'up';

export interface AmbientSignalRouteInput
{
    columns: number;
    rows: number;
    direction: AmbientSignalDirection;
    startCrossAxis: number;
    detours: number;
    minimumPrimarySpan?: number;
    random?: () => number;
}

interface AxisPoint
{
    primary: number;
    cross: number;
}

const DEFAULT_MINIMUM_PRIMARY_SPAN = 2;
const MAXIMUM_CROSS_SPAN = 3;

/**
 * グリッド端から反対側の端まで、主進行方向を反転しない経路を生成する。
 */
export class AmbientSignalRoutePlanner
{
    public plan(input: AmbientSignalRouteInput): GridPoint[]
    {
        this.assertInput(input);

        const horizontal = input.direction === 'right' || input.direction === 'left';
        const positive = input.direction === 'right' || input.direction === 'down';
        const primaryLimit = horizontal ? input.columns : input.rows;
        const crossLimit = horizontal ? input.rows : input.columns;
        const minimumPrimarySpan = input.minimumPrimarySpan ?? DEFAULT_MINIMUM_PRIMARY_SPAN;
        const random = input.random ?? Math.random;
        const maximumDetours = Math.max(0, Math.floor(primaryLimit / minimumPrimarySpan) - 1);
        const detours = crossLimit === 0
            ? 0
            : Math.min(input.detours, maximumDetours);
        const startPrimary = positive ? 0 : primaryLimit;
        const endPrimary = positive ? primaryLimit : 0;
        const sign = positive ? 1 : -1;
        const points: AxisPoint[] = [{
            primary: startPrimary,
            cross: this.clampInteger(input.startCrossAxis, 0, crossLimit),
        }];

        for (let index = 0; index < detours; index += 1) {
            const current = points[points.length - 1];
            const remainingDistance = Math.abs(endPrimary - current.primary);
            const remainingPrimarySegments = detours - index;
            const maximumAdvance = remainingDistance - (remainingPrimarySegments * minimumPrimarySpan);
            const advance = this.randomInteger(minimumPrimarySpan, maximumAdvance, random);
            const primaryTurn = {
                primary: current.primary + (advance * sign),
                cross: current.cross,
            };
            const crossTurn = {
                primary: primaryTurn.primary,
                cross: this.nextCrossAxis(primaryTurn.cross, crossLimit, random),
            };

            points.push(primaryTurn, crossTurn);
        }

        const lastPoint = points[points.length - 1];
        if (lastPoint.primary !== endPrimary) {
            points.push({ primary: endPrimary, cross: lastPoint.cross });
        }

        return points.map((point) => this.toGridPoint(point, horizontal));
    }

    private nextCrossAxis(current: number, limit: number, random: () => number): number
    {
        const canMoveNegative = current > 0;
        const canMovePositive = current < limit;
        let sign = random() < 0.5 ? -1 : 1;

        if (!canMoveNegative) {
            sign = 1;
        } else if (!canMovePositive) {
            sign = -1;
        }

        const availableDistance = sign > 0 ? limit - current : current;
        const maximumDistance = Math.min(MAXIMUM_CROSS_SPAN, availableDistance);
        const distance = this.randomInteger(1, maximumDistance, random);

        return current + (distance * sign);
    }

    private toGridPoint(point: AxisPoint, horizontal: boolean): GridPoint
    {
        if (horizontal) {
            return { column: point.primary, row: point.cross };
        }

        return { column: point.cross, row: point.primary };
    }

    private randomInteger(minimum: number, maximum: number, random: () => number): number
    {
        if (maximum <= minimum) {
            return minimum;
        }

        const value = Math.min(0.999999, Math.max(0, random()));

        return minimum + Math.floor(value * ((maximum - minimum) + 1));
    }

    private clampInteger(value: number, minimum: number, maximum: number): number
    {
        return Math.min(maximum, Math.max(minimum, Math.round(value)));
    }

    private assertInput(input: AmbientSignalRouteInput): void
    {
        if (!Number.isInteger(input.columns) || input.columns <= 0) {
            throw new RangeError('Grid columns must be a positive integer.');
        }

        if (!Number.isInteger(input.rows) || input.rows <= 0) {
            throw new RangeError('Grid rows must be a positive integer.');
        }

        if (!Number.isInteger(input.detours) || input.detours < 0) {
            throw new RangeError('Signal detours must be a non-negative integer.');
        }

        if (!Number.isFinite(input.startCrossAxis)) {
            throw new RangeError('Signal start position must be finite.');
        }

        const minimumPrimarySpan = input.minimumPrimarySpan ?? DEFAULT_MINIMUM_PRIMARY_SPAN;
        if (!Number.isInteger(minimumPrimarySpan) || minimumPrimarySpan <= 0) {
            throw new RangeError('Minimum primary span must be a positive integer.');
        }
    }
}
