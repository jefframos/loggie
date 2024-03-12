import Eugine from "core/Eugine";
import GameObject from "../gameObject/GameObject";
import { Input } from "phaser";

export enum EMouseButtons {
    MOUSE_LEFT,
    MOUSE_RIGHT,
    MOUSE_MIDDLE,
    MAX
}

export class InputSystem extends GameObject {

    private lastButtonStates: boolean[] = [];
    private thisButtonStates: boolean[] = [];

    private showDebug: boolean = false;
    private pointer: Input.Pointer;
    private buttonRects = [];
    private disabled = false;
    private lastClickTime = 0.0;

    constructor(scene: Phaser.Scene, eugine:Eugine) {
        super(scene, eugine);
        this.pointer = this.scene.input.activePointer;
        for (let i = 0; i < EMouseButtons.MAX; ++i) {
            this.lastButtonStates.push(false);
            this.thisButtonStates.push(false);;
        }
    }

    update(delta: number, time: number): void {
        super.update(delta, time);
        this.pointer = this.scene.input.activePointer;
        for (let i = 0; i < this.thisButtonStates.length; ++i) {
            this.lastButtonStates[i] = this.thisButtonStates[i];
        }

        this.thisButtonStates[EMouseButtons.MOUSE_LEFT] = this.pointer.leftButtonDown();
        this.thisButtonStates[EMouseButtons.MOUSE_RIGHT] = this.pointer.rightButtonDown();

        if (this.buttonClicked(EMouseButtons.MOUSE_LEFT) == false)
            this.lastClickTime += delta;
        else
            this.lastClickTime = 0.0;
    }

    getLastClickTime(): number {
        return this.lastClickTime;
    }

    buttonClicked(_button: EMouseButtons): boolean {
        if (this.disabled == true)
            return false;
        return (this.thisButtonStates[_button] == true && this.lastButtonStates[_button] == false);
    }

    buttonReleased(_button: EMouseButtons): boolean {
        if (this.disabled == true)
            return false;
        return (this.thisButtonStates[_button] == false && this.lastButtonStates[_button] == true);
    }

    buttonDown( _button:EMouseButtons ) {
        if( this.disabled)
            return false;
        return(this.thisButtonStates[_button]);
    }

    disableInput(): void {
        this.disabled = true;
    }
}