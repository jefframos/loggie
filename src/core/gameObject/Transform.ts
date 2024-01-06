import GameObject from "./GameObject";
import Vector3 from "./Vector3";

export default class Transform {

    public position: Vector3 = new Vector3();
    public localPosition: Vector3 = new Vector3();
    public angle: number = 0;
    public parent?: Transform;
    public gameObject: GameObject;
    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.position = new Vector3();
        this.localPosition = new Vector3();
        this.angle = 0;
    }
}