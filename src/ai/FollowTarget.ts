import Eugine from "eugine/core/Eugine";
import Component from "eugine/core/components/Component";
import GameObject from "eugine/core/gameObject/GameObject";
import MatterPhysicsObject from "eugine/core/physics/MatterPhysicsObject";
import PhysicsGameObject from "eugine/core/physics/PhysicsGameObject";
import MathUtils from "eugine/core/utils/MathUtils";

export default class FollowTarget extends Component {

    targetSpeed: number = 0;
    currentSpeed: number = 0;
    maxSpeed: number = 100;
    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);
    }
    
    updateTarget(target: GameObject, intersects: boolean) {

        const parent = this.gameObject as unknown as MatterPhysicsObject;

        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08) * 0.001
        if (target.transform.position.distance(parent.transform.position) > 30) {
            parent.latestDirection = target.transform.position.clone().subtract(parent.transform.position).normalize();
            this.targetSpeed = this.maxSpeed;
            if (intersects) {
                //this.targetSpeed *= 0.1
            }
            //this.targetSpeed = this.targetSpeed < 10 ? 0 : this.targetSpeed;

        } else {
            this.targetSpeed = 0;
        }

        parent.physicsEntity.setFriction(1); 
        parent.physicsEntity.applyForce(new Phaser.Math.Vector2(parent.latestDirection.x * this.currentSpeed,parent.latestDirection.z * this.currentSpeed))
        // parent.physicsEntity.setVelocityX( parent.latestDirection.x * this.currentSpeed);
        // parent.physicsEntity.setVelocityY(parent.latestDirection.z * this.currentSpeed);
    }

    reset() {
        const parent = this.gameObject as unknown as PhysicsGameObject;
        parent.velocityX = 0;
        parent.velocityY = 0;
    }
}