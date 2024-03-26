import { CardinalDirection } from "../utils/Cardinals";
import GameObject from "./GameObject";
import Vector3 from "./Vector3";


export default class Transform {

    public position: Vector3 = new Vector3();
    public localPosition: Vector3 = new Vector3();
    public lookDirection: Vector3 = new Vector3();
    protected _angle: number = 0;
    protected _lookAtAngle: number = 0;
    public parent?: Transform;
    public gameObject: GameObject;
    public direction2: CardinalDirection = CardinalDirection.East;
    public direction4: CardinalDirection = CardinalDirection.East;
    public direction8: CardinalDirection = CardinalDirection.East;
    public lookAtdirection2: CardinalDirection = CardinalDirection.East;
    public lookAtdirection4: CardinalDirection = CardinalDirection.East;
    public lookAtdirection8: CardinalDirection = CardinalDirection.East;
    public set angle(value:number){
        this.direction2 = this.getDirection2(this._angle);
        this.direction4 = this.getDirection4(this._angle);
        this.direction8 = this.getDirection8(this._angle);
        this._angle = value;
    }
    public get angle():number{
        return this._angle;
    }

    public set lookAtAngle(value:number){
        this.lookAtdirection2 = this.getDirection2(this._lookAtAngle);
        this.lookAtdirection4 = this.getDirection4(this._lookAtAngle);
        this.lookAtdirection8 = this.getDirection8(this._lookAtAngle);
        this._lookAtAngle = value;
    }
    public get lookAtAngle():number{
        return this._lookAtAngle;
    }

    constructor(gameObject: GameObject) {
        this.gameObject = gameObject;
        this.position = new Vector3();
        this.localPosition = new Vector3();
        this._angle = 0;
    }

     
    getDirection2(angle:number): CardinalDirection {
        // Convert angle to range [0, 2π)
        if(Math.cos(angle) < 0){
            return CardinalDirection.East;
        }else{
            return CardinalDirection.West;
        }
    
    }
    getDirection4(angle:number): CardinalDirection {
        // Convert angle to range [0, 2π)
        angle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
        // Determine the direction based on the angle
        if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
            return CardinalDirection.South;
        } else if (angle >= 3 * Math.PI / 4 && angle < 5 * Math.PI / 4) {
            return CardinalDirection.West;
        } else if (angle >= 5 * Math.PI / 4 && angle < 7 * Math.PI / 4) {
            return CardinalDirection.North;
        } else {
            return CardinalDirection.East;
        }
    }
    
    getDirection8(angle:number): CardinalDirection {
        // Convert this._angle to range [0, 2π)
        angle = ((angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    
        // Determine the direction based on the angle
        if (angle >= Math.PI / 8 && angle < 3 * Math.PI / 8) {
            return CardinalDirection.SouthEast;
        } else if (angle >= 3 * Math.PI / 8 && angle < 5 * Math.PI / 8) {
            return CardinalDirection.South;
        } else if (angle >= 5 * Math.PI / 8 && angle < 7 * Math.PI / 8) {
            return CardinalDirection.SouthWest;
        } else if (angle >= 7 * Math.PI / 8 && angle < 9 * Math.PI / 8) {
            return CardinalDirection.West;
        } else if (angle >= 9 * Math.PI / 8 && angle < 11 * Math.PI / 8) {
            return CardinalDirection.NorthWest;
        } else if (angle >= 11 * Math.PI / 8 && angle < 13 * Math.PI / 8) {
            return CardinalDirection.North;
        } else if (angle >= 13 * Math.PI / 8 && angle < 15 * Math.PI / 8) {
            return CardinalDirection.NorthEast;
        } else {
            return CardinalDirection.East;
        }
    }
    
}