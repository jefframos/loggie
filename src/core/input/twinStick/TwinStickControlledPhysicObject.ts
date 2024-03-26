
import BaseComponent from "loggie/core/gameObject/BaseComponent";
import MathUtils from "loggie/utils/MathUtils";
import TwinStickInputService from "./TwinStickInputService";
import GameView from "loggie/core/view/GameView";
import GuiDebugger from "loggie/core/debug/GuiDebugger";


export default class TwinStickControlledPhysicObject extends BaseComponent {

    private targetSpeed: number = 0;
    private currentSpeed: number = 0;
    public maxSpeed: number = 3000;
    private movementService!: TwinStickInputService;

    private debugTwinStick:any= {};

    build(speed: number = 1000): void {
        super.build();
        if (speed) {
            this.maxSpeed = speed;
        }

        this.debugTwinStick = {rightStickAngle:0.1}
        GuiDebugger.instance.listenFolder('TwinStick', this.debugTwinStick);
    }
    afterBuild(): void {
        
        this.loggie.tryFindByType<TwinStickInputService>(TwinStickInputService, this.movementService);
        if (!this.movementService) {
            this.movementService = this.loggie.poolGameObject<TwinStickInputService>(TwinStickInputService)

            const gameView = this.gameObject.findComponent(GameView);
            if(gameView){
                this.movementService.build(gameView);
            }
        }
    }
    update(delta: number, time: number): void {
        super.update(delta, time);

        if (!this.movementService) {
            return;
        }
        //console.log()

        this.debugTwinStick.rightStickAngle = this.movementService.rightAngle

        this.gameObject.transform.lookAtAngle = this.movementService.rightAngle + Math.PI


        this.currentSpeed = MathUtils.lerp(this.currentSpeed, this.targetSpeed, 0.08)
        if (this.movementService.leftPointerDown) {
            const dist = Math.pow(this.movementService.leftInputNormal, 0.5)
            this.gameObject.rigidBody.targetVelocity.x = Math.floor(Math.cos(this.movementService.leftAngle) * this.currentSpeed * dist)
            this.gameObject.rigidBody.targetVelocity.z = Math.floor(Math.sin(this.movementService.leftAngle) * this.currentSpeed * dist)
            this.targetSpeed = this.maxSpeed;
        } else {
            this.gameObject.rigidBody.targetVelocity.x = 0
            this.gameObject.rigidBody.targetVelocity.z = 0
            this.targetSpeed = 0;
        }
    }
    public lateUpdate(delta: number, unscaledDelta: number): void {
        super.lateUpdate(delta, unscaledDelta)
    }

}