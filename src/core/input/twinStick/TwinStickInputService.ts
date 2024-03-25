import * as PIXI from 'pixi.js';
import AnalogInput, { AnalogInputType } from "../AnalogInput";
import { InputDirections } from "../InputDirection";
import WasdInput from "../WasdInput";
import GameView from '../../view/GameView';
import AppSingleton from 'loggie/AppSingleton';
import GameObject from 'loggie/core/gameObject/GameObject';

export default class TwinStickInputService extends GameObject {
    private leftAnalog!: InputDirections;
    public rightAnalog!: InputDirections;
    private wasdProvider!: InputDirections;
    private activeLeftProvider!: InputDirections;
    private activeRightProvider!: InputDirections;
    private gameView!: GameView;
    build(gameView: GameView) {
        this.gameView = gameView;

        const analogInput = this.loggie.poolGameObject(AnalogInput) as AnalogInput;
        analogInput.build(AnalogInputType.Left);
        this.leftAnalog = analogInput;
        if (!PIXI.isMobile.any) {
            const wasdInput = this.loggie.poolGameObject(WasdInput) as WasdInput;
            wasdInput.build();
            this.wasdProvider = wasdInput;
        } else {

            const analogInputRight = this.loggie.poolGameObject(AnalogInput) as AnalogInput;
            analogInputRight.build(AnalogInputType.Right);
            this.rightAnalog = analogInputRight;
        }

        this.activeLeftProvider = this.currentLeftActive();
        this.activeRightProvider = this.currentRightActive();
    }
    get leftAngle() {      
        return Math.atan2(this.leftDirection.y, this.leftDirection.x);
    }
    get leftDirection() {
        return this.activeLeftProvider.getDirections();
    }
    get leftPointerDown() {
        return this.activeLeftProvider.getPressed();
    }
    get leftInputNormal() {
        return this.activeLeftProvider.getNormal();
    }
    get rightAngle() {
        if (!PIXI.isMobile.any) {
            return this.getMouseAngleFromGameView(this.gameView)
        }
        return Math.atan2(this.activeRightProvider.getDirections().y, this.activeRightProvider.getDirections().x);
    }
    get rightDirection() {
        if (!PIXI.isMobile.any) {
            return this.getMouseAngleFromGameView(this.gameView)
        }
        return this.activeRightProvider.getDirections();
    }
    get rightPointerDown() {
        if (!PIXI.isMobile.any) {
            return 1
        }
        return this.activeRightProvider.getPressed();
    }
    get rightInputNormal() {
        if (!PIXI.isMobile.any) {
            return 1
        }
        return this.activeRightProvider.getNormal();
    }

    currentLeftActive(): InputDirections {
        if (this.wasdProvider) {
            return this.wasdProvider;
        } else {
            return this.leftAnalog;
        }
    }
    currentRightActive(): InputDirections {
        return this.rightAnalog;
    }
    getMouseAngleFromGameView(gameView: GameView) {
        return Math.atan2(gameView.view.y - AppSingleton.globalPointer.y, gameView.view.x - AppSingleton.globalPointer.x)
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);
        this.activeLeftProvider = this.currentLeftActive();
        this.activeRightProvider = this.currentRightActive();
    }
}