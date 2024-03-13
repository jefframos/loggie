import * as PIXI from 'pixi.js';

export default class MathUtils {

    static lerpAngle(startAngle: number, endAngle: number, t: number): number {
        // Ensure that the angles are in the range [0, 360)
        startAngle = (startAngle % 360 + 360) % 360;
        endAngle = (endAngle % 360 + 360) % 360;

        // Calculate the shortest angular distance between start and end angles
        let deltaAngle = ((endAngle - startAngle + 180) % 360) - 180;

        // Perform linear interpolation
        return startAngle + t * deltaAngle;
    }

    static lerpAngleRad(startAngle: number, endAngle: number, t: number): number {
        // Ensure that the angles are in the range [0, 360)
        startAngle *= 180 / Math.PI
        endAngle *= 180 / Math.PI
        startAngle = (startAngle % 360 + 360) % 360;
        endAngle = (endAngle % 360 + 360) % 360;

        // Calculate the shortest angular distance between start and end angles
        let deltaAngle = ((endAngle - startAngle + 180) % 360) - 180;

        // Perform linear interpolation
        return (startAngle / 180 * Math.PI) + t * (deltaAngle / 180 * Math.PI);
    }

    static lerp(start: number, end: number, alpha: number): number {
        return start + alpha * (end - start);
    }
    static distance(x1: number, y1: number, x2: number, y2: number): number {
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;

        // Applying the Pythagorean theorem
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        return distance;
    }
    static normalizePoint(point: PIXI.Point) {
        // Calculate the magnitude of the vector
        const magnitude = Math.sqrt(point.x * point.x + point.y * point.y);

        // Check if the magnitude is zero to avoid division by zero
        if (magnitude !== 0) {
            // Normalize the point by dividing each component by the magnitude
            point.x = point.x / magnitude
            point.y = point.y / magnitude
        };
    }

}