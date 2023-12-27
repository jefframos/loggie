import Vector3 from "./Vector3";

export default class Transform {
    constructor() {
        this.position = new Vector3();
        this.localPosition = new Vector3();
        this.angle = 0;
    }
}