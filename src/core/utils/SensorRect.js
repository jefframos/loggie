import Layer from "../Layer";
import Sensor from "./Sensor";
import signals from "signals";

export default class SensorRect extends Sensor {
    constructor() {
        super();

    }

    build(width = 50, height = 50, anchor = { x: 0, y: 0 }) {
        super.build()

        let vertices = [
            { x: 0, y: 0 },
            { x: width, y: 0 },
            { x: width, y: height },
            { x: 0, y: height }
        ]

        this.buildRect(-anchor.x * width, - anchor.y * height, width, height)
        this.rigidBody.isSensor = true;
        this.autoSetAngle = false;
        this.layerCategory = Layer.Sensor
        this.layerMask = Layer.Enemy - Layer.Player

    }
    destroy(){
        super.destroy()
    }
}