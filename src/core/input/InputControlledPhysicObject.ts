import GameObject from "../gameObject/GameObject";
import MovementInputService from "./MovementInputService";
import BaseComponent from "../gameObject/BaseComponent";
import MathUtils from "loggie/utils/MathUtils";


export default class InputControlledPhysicObject extends BaseComponent {

    private targetSpeed: number = 0;
    private currentSpeed: number = 0;
    public maxSpeed: number = 3000;
    private movementService!: MovementInputService;
 
    build(speed:number = 1000): void {
        super.build();
        if(speed){
            this.maxSpeed = speed;
        }
        this.loggie.tryFindByType<MovementInputService>(MovementInputService, this.movementService);
        if(!this.movementService){
            this.movementService = this.loggie.poolGameObject<MovementInputService>(MovementInputService, true)

        }
    }
    update(delta: number, time: number): void {
        super.update(delta, time);
        
        if (!this.movementService) {
            return;
        }
        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08)
        if (this.movementService.pointerDown) {
            const dist = Math.pow(this.movementService.inputNormal, 0.5)
            this.gameObject.rigidBody.velocityX = this.movementService.direction.x * this.currentSpeed * dist
            this.gameObject.rigidBody.velocityY = this.movementService.direction.y * this.currentSpeed * dist
            this.targetSpeed = this.maxSpeed;
        } else {
            this.gameObject.rigidBody.velocityX = 0
            this.gameObject.rigidBody.velocityY = 0
            this.targetSpeed = 0;
        }
    }

}