export default class Color {
    constructor() { }

    static toRGB(rgb) {
        var r = rgb >> 16 & 0xFF;
        var g = rgb >> 8 & 0xFF;
        var b = rgb & 0xFF;
        return {
            r: r,
            g: g,
            b: b
        };
    }
    static rgbToColor(color) {
        return color.r << 16 | color.g << 8 | color.b;
    }

    static colorLerp(outRGB, color, targetColor, t) {
        outRGB.r = Math.floor(t * (targetColor.r - color.r) + color.r);
        outRGB.g = Math.floor(t * (targetColor.g - color.g) + color.g);
        outRGB.b = Math.floor(t * (targetColor.b - color.b) + color.b);
    }
}