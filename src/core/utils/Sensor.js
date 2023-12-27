import Layer from "../Layer";
import PhysicsEntity from "../physics/PhysicsEntity";
import signals from "signals";

export default class Sensor extends PhysicsEntity {
    constructor() {
        super();
        this.onTrigger = new signals.Signal();
        this.onCollisionEnter = new signals.Signal();
        this.onCollisionExit = new signals.Signal();
        this.collisionList = []

        
    }
    build(radius = 50) {
        super.build()
        this.collisionList = []
        this.buildCircle(0, 0, radius)
        this.rigidBody.isSensor = true;
        this.layerCategory = Layer.Sensor
        this.layerMask = Layer.Enemy - Layer.Player

    }
    resetCollisionList(){
        this.collisionList = []
    }
    collisionExit(collided) {
        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID >= 0) {
            this.collisionList.splice(collidedID, 1)
        }
        this.onCollisionExit.dispatch(collided)
    }
    collisionStay(collided) {
        if (collided.rigidBody.isStatic) return
        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID < 0) {
            this.collisionList.push(collided)
            this.onTrigger.dispatch(collided)
        }
    }
    collisionEnter(collided) {
        if (collided.rigidBody.isStatic) return
        var collidedID = this.collisionList.map(function (x) { return x.engineID; }).indexOf(collided.engineID);
        if (collidedID < 0) {
            this.collisionList.push(collided)
        }
        this.onCollisionEnter.dispatch(collided)
    }
    update(delta, unscaled) {
        super.update(delta, unscaled)
        for (var i = this.collisionList.length - 1; i >= 0; i--) {
            if (this.collisionList[i].dying || this.collisionList[i].destroyed) {
                this.collisionList.splice(i, 1);
            }
        }
    }
}