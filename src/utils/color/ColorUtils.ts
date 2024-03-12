import { ColorStop } from "./ColorStop";

export default class ColorUtils {
    static interpolateColor(color1: number, color2: number, factor: number): number {
        // Extract RGB components of color1
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;

        // Extract RGB components of color2
        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        // Interpolate each RGB component separately
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        // Combine the interpolated RGB components into a single color
        return (r << 16) | (g << 8) | b;
    }

    // Function to interpolate colors based on multiple color stops
    static interpolateGradient(colorStops: ColorStop[], factor: number): number {
        // Sort color stops by position

        factor = Math.max(Math.min(1, factor), 0)
        colorStops.sort((a, b) => a.position - b.position);

        // Find the two color stops that the factor falls between
        let startIndex = 0;
        while (startIndex < colorStops.length - 1 && colorStops[startIndex + 1].position <= factor) {
            startIndex++;
        }
        if(startIndex >= colorStops.length - 1){
            return colorStops[startIndex].color
        }
        const colorStop1 = colorStops[startIndex];
        const colorStop2 = colorStops[startIndex + 1];

        // Calculate the factor relative to the two color stops
        const relativeFactor = (factor - colorStop1.position) / (colorStop2.position - colorStop1.position);

        // Interpolate the colors
        return ColorUtils.interpolateColor(colorStop1.color, colorStop2.color, relativeFactor);
    }
}