import { describe, expect, it } from 'vitest';
import { GridMetrics } from './grid-metrics';

describe('GridMetrics', () => {
    it('converts grid coordinates to document coordinates and back', () => {
        const metrics = new GridMetrics({
            columns: 16,
            origin: { x: 64, y: 48 },
            width: 1312,
            rowHeight: 48,
            documentHeight: 1600,
        });

        const documentPoint = metrics.gridToDocument({ column: 5, row: 3 });

        expect(metrics.cellWidth).toBe(82);
        expect(documentPoint).toEqual({ x: 474, y: 192 });
        expect(metrics.documentToGrid(documentPoint)).toEqual({ column: 5, row: 3 });
        expect(metrics.getHeaderArrivalPoint()).toEqual({ x: 64, y: 48 });
    });

    it('snaps to a visible intersection and clamps horizontal page edges', () => {
        const metrics = new GridMetrics({
            columns: 4,
            origin: { x: 20, y: 40 },
            width: 320,
            rowHeight: 40,
            documentHeight: 1200,
        });

        expect(metrics.snapToIntersection({ x: 132, y: 105 })).toEqual({ x: 100, y: 120 });
        expect(metrics.snapToIntersection({ x: -500, y: -50 })).toEqual({ x: 20, y: 40 });
        expect(metrics.snapToIntersection({ x: 900, y: 86 })).toEqual({ x: 340, y: 80 });
    });

    it.each([
        { columns: 16, width: 1280, expectedCellWidth: 80 },
        { columns: 12, width: 960, expectedCellWidth: 80 },
        { columns: 4, width: 320, expectedCellWidth: 80 },
    ])('updates the $columns-column responsive grid', ({ columns, width, expectedCellWidth }) => {
        const metrics = new GridMetrics({
            columns: 16,
            origin: { x: 0, y: 48 },
            width: 1280,
            rowHeight: 48,
            documentHeight: 1000,
        });

        metrics.update({
            columns,
            origin: { x: 20, y: columns === 4 ? 40 : 48 },
            width,
            rowHeight: columns === 4 ? 40 : 48,
            documentHeight: 1000,
        });

        expect(metrics.columns).toBe(columns);
        expect(metrics.cellWidth).toBe(expectedCellWidth);
    });

    it('rejects invalid geometry', () => {
        expect(() => new GridMetrics({
            columns: 0,
            origin: { x: 0, y: 0 },
            width: 100,
            rowHeight: 40,
            documentHeight: 100,
        })).toThrow(RangeError);
    });
});
