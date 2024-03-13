
import * as PIXI from 'pixi.js';
import BaseComponent from "../gameObject/BaseComponent";
import GameObject from "../gameObject/GameObject";
import AnalogInput from "./AnalogInput";
import { InputDirections } from "./InputDirection";
import WasdInput from "./WasdInput";

export default class MovementInputService extends GameObject {
    private analogProvider!: InputDirections;
    private wasdProvider!: InputDirections;
    private activeProvider!: InputDirections;
    build() {
        const analogInput = this.loggie.poolGameObject(AnalogInput) as AnalogInput;
        analogInput.build();
        this.analogProvider = analogInput;
        if (!PIXI.isMobile.any) {
            const wasdInput = this.loggie.poolGameObject(WasdInput) as WasdInput;
            wasdInput.build();
            this.wasdProvider = wasdInput;
        }

        this.activeProvider = this.currentActive();
    }
    get direction() {
        return this.activeProvider.getDirections();
    }
    get pointerDown() {
        return this.activeProvider.getPressed();
    }
    get inputNormal() {
        return this.activeProvider.getNormal();
    }
    currentActive(): InputDirections {
        if (this.wasdProvider && this.wasdProvider.getPressed()) {
            return this.wasdProvider;
        } else {
            return this.analogProvider;
        }
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);

        this.activeProvider = this.currentActive();
    }
}