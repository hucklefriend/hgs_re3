import { describe, expect, it } from 'vitest';
import { GridMetrics, type DocumentPoint } from '../grid/grid-metrics';
import { HandoffRoutePlanner } from './handoff-route-planner';

const metrics = new GridMetrics({
    columns: 16,
    origin: { x: 64, y: 48 },
    width: 1280,
    rowHeight: 48,
    documentHeight: 3000,
});

describe('HandoffRoutePlanner', () => {
    it('connects an arbitrary document point to the header node with orthogonal segments', () => {
        const origin = { x: 913, y: 2237 };
        const route = new HandoffRoutePlanner().plan(origin, metrics);

        expect(route[0]).toEqual(origin);
        expect(route[route.length - 1]).toEqual(metrics.getHeaderArrivalPoint());
        route.slice(1).forEach((point, index) => {
            const previous = route[index];
            expect(point.x === previous.x || point.y === previous.y).toBe(true);
        });
    });

    it('uses grid intersections after its short origin connector', () => {
        const route = new HandoffRoutePlanner().plan({ x: 913, y: 2237 }, metrics);

        route.slice(2).forEach((point) => {
            const gridPoint = metrics.documentToGrid(point);
            expect(Number.isInteger(gridPoint.column)).toBe(true);
            expect(Number.isInteger(gridPoint.row)).toBe(true);
        });
    });

    it('removes zero-length segments when the terminal is already on the grid', () => {
        const origin: DocumentPoint = metrics.gridToDocument({ column: 0, row: 0 });
        const route = new HandoffRoutePlanner().plan(origin, metrics);

        expect(route).toEqual([origin]);
    });
});
