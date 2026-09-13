// точка с координатами
export interface Point {
    x: number;
    y: number;
}

// линия из двух точек
export interface Line {
    start: Point;
    end: Point;
}

// окружность с центром и радиусом
export interface Circle {
    center: Point;
    radius: number;
}

// любая фигура
export type Figure =
    | { type: 'point'; data: Point }
    | { type: 'line'; data: Line }
    | { type: 'circle'; data: Circle };

// превращает фигуру в строку для печати
export function figureToString(fig: Figure): string {
    if (fig.type === 'point') {
        const { x, y } = fig.data;
        return `Point(${x}, ${y})`;
    }
    if (fig.type === 'line') {
        const { start, end } = fig.data;
        return `Line(Point(${start.x}, ${start.y}), Point(${end.x}, ${end.y}))`;
    }
    const { center, radius } = fig.data;
    return `Circle(Point(${center.x}, ${center.y}), ${radius})`;
}