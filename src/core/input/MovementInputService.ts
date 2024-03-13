
import * as PIXI from 'pixi.js';
import BaseComponent from "../gameObject/BaseComponent";
import GameObject from "../gameObject/GameObject";
import AnalogInput from "./AnalogInput";
import { InputDirections } from "./InputDirection";
import WasdInput from "./WasdInput";

export default class MovementInputService extends GameObject {
    private inputProvider!: InputDirections;

    build(){
        if (PIXI.isMobile.any) {
            const analogInput = this.loggie.poolGameObject(AnalogInput) as AnalogInput;
            analogInput.build();
            this.inputProvider = analogInput;
        } else {
            const wasdInput = this.loggie.poolGameObject(WasdInput) as WasdInput;
            wasdInput.build();
            this.inputProvider = wasdInput;
        }
    }
    get direction() {
        return this.inputProvider.getDirections();
    }
    get pointerDown() {
        return this.inputProvider.getPressed();
    }
    get inputNormal() {
        return this.inputProvider.getNormal();
    }
}