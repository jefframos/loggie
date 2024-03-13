import Eugine from "eugine/core/Eugine";
import Component from "eugine/core/components/Component";
import GameObject from "eugine/core/gameObject/GameObject";
import PhysicsGameObject from "eugine/core/physics/PhysicsGameObject";
import MathUtils from "eugine/core/utils/MathUtils";

export default class Wander extends Component {

    private targetSpeed: number = 0;
    private currentSpeed: number = 0;
    public maxSpeed: number = 0.1;

    public wanderTime: number = 2;
    private currentWanderTime: number = 2;

    public waitTime: number = 2;
    private currentWaitTime: number = 2;

    private originPoint: Phaser.Math.Vector3 = new Phaser.Math.Vector3();
    private direction: number = 0;

    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);
    }
    setOriginPoint(point: Phaser.Math.Vector3) {
        this.originPoint = point;
    }
    updateBehaviour(delta: number, time: number) {

        const parent = this.gameObject as unknown as PhysicsGameObject;
        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08)

        if (this.currentWanderTime >= 0) {
            this.targetSpeed = this.maxSpeed;
            parent.velocityX = Math.cos(this.direction) * this.currentSpeed;
            parent.velocityY = Math.sin(this.direction) * this.currentSpeed;
            this.currentWanderTime -= delta;
            this.currentWaitTime = this.waitTime;
        } else {
            if (this.currentWaitTime >= 0) {
                this.currentWaitTime -= delta;
                this.targetSpeed = 0;
            } else {
                if (parent.transform.position.distance(this.originPoint) > 100) {
                    this.direction = Phaser.Math.Angle.Between(parent.physicsEntity.y, parent.physicsEntity.x, this.originPoint.y, this.originPoint.x)
                } else {
                    this.direction = Math.random() * Math.PI * 2;
                }
                this.currentWanderTime = this.wanderTime;
            }
        }
    }

    reset() {
        const parent = this.gameObject as unknown as PhysicsGameObject;
        parent.velocityX = 0;
        parent.velocityY = 0;
        this.currentWanderTime = -1;
        this.currentWaitTime = this.waitTime / 2 + Math.random() * this.waitTime / 2;
    }
}