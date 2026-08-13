export interface DocumentPoint
{
    x: number;
    y: number;
}

export interface GridPoint
{
    column: number;
    row: number;
}

export interface GridMetricsInput
{
    columns: number;
    origin: DocumentPoint;
    width: number;
    rowHeight: number;
    documentHeight: number;
}

/**
 * ページ共通グリッドの座標計算。
 *
 * DOMを参照しないため、描画側とは独立して境界値を検証できる。
 */
export class GridMetrics
{
    private _columns: number;
    private _origin: DocumentPoint;
    private _width: number;
    private _rowHeight: number;
    private _documentHeight: number;

    public constructor(input: GridMetricsInput)
    {
        this.assertInput(input);
        this._columns = input.columns;
        this._origin = { ...input.origin };
        this._width = input.width;
        this._rowHeight = input.rowHeight;
        this._documentHeight = input.documentHeight;
    }

    public update(input: GridMetricsInput): void
    {
        this.assertInput(input);
        this._columns = input.columns;
        this._origin = { ...input.origin };
        this._width = input.width;
        this._rowHeight = input.rowHeight;
        this._documentHeight = input.documentHeight;
    }

    public get columns(): number
    {
        return this._columns;
    }

    public get origin(): DocumentPoint
    {
        return { ...this._origin };
    }

    public get width(): number
    {
        return this._width;
    }

    public get cellWidth(): number
    {
        return this._width / this._columns;
    }

    public get rowHeight(): number
    {
        return this._rowHeight;
    }

    public get documentHeight(): number
    {
        return this._documentHeight;
    }

    public gridToDocument(point: GridPoint): DocumentPoint
    {
        return {
            x: this._origin.x + (point.column * this.cellWidth),
            y: this._origin.y + (point.row * this._rowHeight),
        };
    }

    public documentToGrid(point: DocumentPoint): GridPoint
    {
        return {
            column: (point.x - this._origin.x) / this.cellWidth,
            row: (point.y - this._origin.y) / this._rowHeight,
        };
    }

    public snapToIntersection(point: DocumentPoint): DocumentPoint
    {
        const gridPoint = this.documentToGrid(point);

        return this.gridToDocument({
            column: Math.min(this._columns, Math.max(0, Math.round(gridPoint.column))),
            row: Math.max(0, Math.round(gridPoint.row)),
        });
    }

    public getHeaderArrivalPoint(): DocumentPoint
    {
        return this.gridToDocument({ column: 0, row: 0 });
    }

    private assertInput(input: GridMetricsInput): void
    {
        if (!Number.isInteger(input.columns) || input.columns <= 0) {
            throw new RangeError('Grid columns must be a positive integer.');
        }

        if (!Number.isFinite(input.width) || input.width <= 0) {
            throw new RangeError('Grid width must be greater than zero.');
        }

        if (!Number.isFinite(input.rowHeight) || input.rowHeight <= 0) {
            throw new RangeError('Grid row height must be greater than zero.');
        }

        if (!Number.isFinite(input.documentHeight) || input.documentHeight < 0) {
            throw new RangeError('Document height must not be negative.');
        }

        if (!Number.isFinite(input.origin.x) || !Number.isFinite(input.origin.y)) {
            throw new RangeError('Grid origin must contain finite coordinates.');
        }
    }
}
