
import GameObject from "../gameObject/GameObject";
import RigidBody from "../physics/RigidBody";
import { ICollisionEnd } from "../physics/ICollisionEnd";
import { ICollisionEnter } from "../physics/ICollisionEnter";
import { Signal } from "signals";
import GameViewGraphics from "../view/GameViewGraphics";

export default class Sensor extends GameObject implements ICollisionEnd, ICollisionEnter {

    public onTriggerStart: Signal = new Signal();
    public onTriggerEnd: Signal = new Signal();
    public collisionList: Array<RigidBody> = []

    constructor() {
        super();

    }
    build(radius = 50) {
        super.build()
        this.collisionList = []

        this.rigidBody = this.poolComponent(RigidBody) as RigidBody;
        this.rigidBody.buildCircle(radius)
        this.rigidBody.setSensor(true);

    }
    addDebug() {
        const graph = this.poolComponent(GameViewGraphics, true) as GameViewGraphics
        graph.view.beginFill(0xFF0000).drawCircle(0, 0, this.rigidBody.body.circleRadius)
        graph.view.alpha = 0.1;
        
    }
    resetCollisionList() {
        this.collisionList = []
    }
    onCollisionEnd(collided: RigidBody) {
        this.collisionList = this.collisionList.filter(entity => entity.gameObject.GUID == collided.gameObject.GUID)        
    }
    onCollisionEnter(collided: RigidBody) {
        if (collided.body.isStatic) return
        
        if(this.collisionList.includes(collided)){
            return;
        }
        this.collisionList.push(collided)
        this.onTriggerStart.dispatch(collided)      
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);
        this.updateParentingPostion();
        for (var i = this.collisionList.length - 1; i >= 0; i--) {
            if (this.collisionList[i].gameObject.destroyed) {
                this.collisionList.splice(i, 1);
            }
        }
    }
}