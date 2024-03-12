import GameObject from "../gameObject/GameObject";
import MovementInputService from "./MovementInputService";
import Eugine from "../Eugine";
import MatterPhysicsObject from "../physics/MatterPhysicsObject";
import MathUtils from "../utils/MathUtils";


export default class InputControlledPhysicObject extends GameObject {

    private targetSpeed: number = 0;
    private currentSpeed: number = 0;
    public maxSpeed: number = 3;
    private movementService: MovementInputService = Object();
    constructor(scene: Phaser.Scene, eugine: Eugine) {
        super(scene, eugine);
    }
    build(...data: any[]): void {
        super.build();

        this.movementService = this.addFromPool(MovementInputService) as MovementInputService
        this.movementService.build()
    }
    update(delta: number, time: number): void {
        super.update(delta, time);
        
        if (!this.movementService) {
            return;
        }
        
        const parent = this.parent as MatterPhysicsObject;
        if (!parent) {
            return;
        }
        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08)
        if (this.movementService.pointerDown) {
            const dist = Math.pow(this.movementService.inputNormal, 0.5)
            parent.physicsEntity.setVelocityX(this.movementService.direction.x * this.currentSpeed * dist)
            parent.physicsEntity.setVelocityY(this.movementService.direction.y * this.currentSpeed * dist)
            this.targetSpeed = this.maxSpeed;
        } else {
            parent.physicsEntity.setVelocityX(0)
            parent.physicsEntity.setVelocityY(0)
            this.targetSpeed = 0;
        }
    }

}