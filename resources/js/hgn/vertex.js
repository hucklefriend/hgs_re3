export class Vertex
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    move(offsetX, offsetY)
    {
        this.x += offsetX;
        this.y += offsetY;
    }
}
