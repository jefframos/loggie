import { CardinalDirection } from "./CardinalDirection";
import GameObject from "./GameObject";
import Vector3 from "./Vector3";


export default class Transform {

    public position: Vector3 = new Vector3();
    public localPosition: Vector3 = new Vector3();
    protected _angle: number = 0;
    public parent?: Transform;
    public gameObject: GameObject;
    public direction2: CardinalDirection = CardinalDirection.East;
    public direction4: CardinalDirection = CardinalDirection.East;
    public direction8: CardinalDirection = CardinalDirection.East;
    public set angle(value:number){
        this.direction2 = this.getDirection2();
        this.direction4 = this.getDirection4();
        this.direction8 = this.getDirection8();
        this._angle = value;
    }
    public get angle():number{
        return this._angle;
    }
    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.position = new Vector3();
        this.localPosition = new Vector3();
        this._angle = 0;
    }

     
    getDirection2(): CardinalDirection {
        // Convert angle to range [0, 2π)
        if(Math.cos(this._angle) < 0){
            return CardinalDirection.East;
        }else{
            return CardinalDirection.West;
        }
    
    }
    getDirection4(): CardinalDirection {
        // Convert angle to range [0, 2π)
        this._angle = ((this._angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
        // Determine the direction based on the this._angle
        if (this._angle >= Math.PI / 4 && this._angle < 3 * Math.PI / 4) {
            return CardinalDirection.South;
        } else if (this._angle >= 3 * Math.PI / 4 && this._angle < 5 * Math.PI / 4) {
            return CardinalDirection.West;
        } else if (this._angle >= 5 * Math.PI / 4 && this._angle < 7 * Math.PI / 4) {
            return CardinalDirection.North;
        } else {
            return CardinalDirection.East;
        }
    }
    
    getDirection8(): CardinalDirection {
        // Convert this._angle to range [0, 2π)
        this._angle = ((this._angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
        // Determine the direction based on the this._angle
        if (this._angle >= Math.PI / 8 && this._angle < 3 * Math.PI / 8) {
            return CardinalDirection.Southeast;
        } else if (this._angle >= 3 * Math.PI / 8 && this._angle < 5 * Math.PI / 8) {
            return CardinalDirection.South;
        } else if (this._angle >= 5 * Math.PI / 8 && this._angle < 7 * Math.PI / 8) {
            return CardinalDirection.Southwest;
        } else if (this._angle >= 7 * Math.PI / 8 && this._angle < 9 * Math.PI / 8) {
            return CardinalDirection.West;
        } else if (this._angle >= 9 * Math.PI / 8 && this._angle < 11 * Math.PI / 8) {
            return CardinalDirection.Northwest;
        } else if (this._angle >= 11 * Math.PI / 8 && this._angle < 13 * Math.PI / 8) {
            return CardinalDirection.North;
        } else if (this._angle >= 13 * Math.PI / 8 && this._angle < 15 * Math.PI / 8) {
            return CardinalDirection.Northeast;
        } else {
            return CardinalDirection.East;
        }
    }
    
}