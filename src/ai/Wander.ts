import BaseComponent from "loggie/core/gameObject/BaseComponent";
import Vector3 from "loggie/core/gameObject/Vector3";
import MathUtils from "loggie/utils/MathUtils";


export default class Wander extends BaseComponent {

    private targetSpeed: number = 0;
    private currentSpeed: number = 0;
    public maxSpeed: number = 0.1;

    public wanderTime: number = 2;
    private currentWanderTime: number = 2;

    public waitTime: number = 2;
    private currentWaitTime: number = 2;

    private originPoint: Vector3 = new Vector3();
    private direction: number = 0;


    setOriginPoint(point: Vector3) {
        this.originPoint = point;
    }
    updateBehaviour(delta: number, time: number) {

        if (!this.gameObject.rigidBody) {
            return;
        }
        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08)
        this.gameObject.rigidBody.velocityX = Math.cos(this.direction) * this.currentSpeed;
        this.gameObject.rigidBody.velocityY = Math.sin(this.direction) * this.currentSpeed;

        if (this.currentWanderTime >= 0) {
            this.targetSpeed = this.maxSpeed;
            this.currentWanderTime -= delta;
            this.currentWaitTime = this.waitTime;
        } else {
            if (this.currentWaitTime >= 0) {
                this.currentWaitTime -= delta;
                this.targetSpeed = 0;
            } else {
                if (Vector3.distance(this.gameObject.transform.position, this.originPoint) > 100) {
                    this.direction = Vector3.atan2XZ(this.originPoint, this.gameObject.transform.position)
                } else {
                    this.direction = Math.random() * Math.PI * 2;
                }
                this.currentWanderTime = this.wanderTime;
            }
        }
    }

    reset() {
        if (!this.gameObject.rigidBody) {
            return;
        }
        this.gameObject.rigidBody.velocityX = 0;
        this.gameObject.rigidBody.velocityY = 0;
        if (Math.random() > 0.5) {
            this.currentWanderTime = this.wanderTime / 2 + Math.random() * this.wanderTime / 2;
        } else {
            this.currentWanderTime = -1;
            this.currentWaitTime = this.waitTime / 2 + Math.random() * this.waitTime / 2;
        }
    }
}