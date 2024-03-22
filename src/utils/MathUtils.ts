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
    static pointToLineSegmentDistance(x:number, y:number, x1:number, y1:number, x2:number, y2:number) {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
    
        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) //in case of 0 length line
            param = dot / len_sq;
    
        let xx, yy;
    
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
    
        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }  

}