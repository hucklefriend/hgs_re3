import { describe, expect, it } from 'vitest';
import {
    AmbientSignalRoutePlanner,
    type AmbientSignalDirection,
} from './ambient-signal-route-planner';
import type { GridPoint } from './grid-metrics';

const planner = new AmbientSignalRoutePlanner();
const deterministicRandom = (): number => 0.35;

const expectOrthogonalRoute = (route: GridPoint[]): void => {
    route.slice(1).forEach((point, index) => {
        const previous = route[index];
        const changedAxes = Number(point.column !== previous.column) + Number(point.row !== previous.row);
        expect(changedAxes).toBe(1);
    });
};

describe('AmbientSignalRoutePlanner', () => {
    it.each<{
        direction: AmbientSignalDirection;
        primaryAxis: keyof GridPoint;
        start: number;
        end: number;
        increasing: boolean;
    }>([
        { direction: 'right', primaryAxis: 'column', start: 0, end: 16, increasing: true },
        { direction: 'left', primaryAxis: 'column', start: 16, end: 0, increasing: false },
        { direction: 'down', primaryAxis: 'row', start: 0, end: 24, increasing: true },
        { direction: 'up', primaryAxis: 'row', start: 24, end: 0, increasing: false },
    ])('keeps $direction routes monotonic on their primary axis', ({
        direction,
        primaryAxis,
        start,
        end,
        increasing,
    }) => {
        const route = planner.plan({
            columns: 16,
            rows: 24,
            direction,
            startCrossAxis: 7,
            detours: 2,
            random: deterministicRandom,
        });
        const primaryValues = route.map((point) => point[primaryAxis]);

        expect(primaryValues[0]).toBe(start);
        expect(primaryValues[primaryValues.length - 1]).toBe(end);
        primaryValues.slice(1).forEach((value, index) => {
            if (increasing) {
                expect(value).toBeGreaterThanOrEqual(primaryValues[index]);
            } else {
                expect(value).toBeLessThanOrEqual(primaryValues[index]);
            }
        });
        expectOrthogonalRoute(route);
    });

    it('uses only grid intersections and clamps the cross-axis start', () => {
        const route = planner.plan({
            columns: 4,
            rows: 10,
            direction: 'right',
            startCrossAxis: 999,
            detours: 1,
            minimumPrimarySpan: 1,
            random: deterministicRandom,
        });

        route.forEach((point) => {
            expect(Number.isInteger(point.column)).toBe(true);
            expect(Number.isInteger(point.row)).toBe(true);
            expect(point.column).toBeGreaterThanOrEqual(0);
            expect(point.column).toBeLessThanOrEqual(4);
            expect(point.row).toBeGreaterThanOrEqual(0);
            expect(point.row).toBeLessThanOrEqual(10);
        });
        expect(route[0]).toEqual({ column: 0, row: 10 });
        expectOrthogonalRoute(route);
    });

    it('reduces detours when the primary axis is too short', () => {
        const route = planner.plan({
            columns: 2,
            rows: 4,
            direction: 'right',
            startCrossAxis: 2,
            detours: 8,
            random: deterministicRandom,
        });

        expect(route).toEqual([
            { column: 0, row: 2 },
            { column: 2, row: 2 },
        ]);
    });

    it('rejects invalid grid bounds', () => {
        expect(() => planner.plan({
            columns: 0,
            rows: 10,
            direction: 'right',
            startCrossAxis: 0,
            detours: 0,
        })).toThrow(RangeError);
    });
});
