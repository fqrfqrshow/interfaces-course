import { Figure } from './figures';

// разбор строки вида Point(...), Line(...), Circle(...)
export function parseFigure(line: string): Figure | null {
    const trimmed = line.trim();
    if (trimmed.length === 0) return null;

    // Point(x, y)
    const pointMatch = trimmed.match(/^Point\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/);
    if (pointMatch) {
        return {
            type: 'point',
            data: {
                x: parseFloat(pointMatch[1]),
                y: parseFloat(pointMatch[2]),
            },
        };
    }

    // Line(Point(...), Point(...))
    const lineMatch = trimmed.match(
        /^Line\(\s*Point\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)\s*,\s*Point\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)\s*\)$/
    );
    if (lineMatch) {
        return {
            type: 'line',
            data: {
                start: { x: parseFloat(lineMatch[1]), y: parseFloat(lineMatch[2]) },
                end: { x: parseFloat(lineMatch[3]), y: parseFloat(lineMatch[4]) },
            },
        };
    }

    // Circle(Point(...), radius)
    const circleMatch = trimmed.match(
        /^Circle\(\s*Point\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/
    );
    if (circleMatch) {
        const radius = parseFloat(circleMatch[3]);
        if (radius < 0) return null;
        return {
            type: 'circle',
            data: {
                center: { x: parseFloat(circleMatch[1]), y: parseFloat(circleMatch[2]) },
                radius,
            },
        };
    }

    // ничего не подошло
    return null;
}