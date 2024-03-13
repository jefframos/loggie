
import * as PIXI from "pixi.js";

import GameObject from '../gameObject/GameObject';
import { Signal } from 'signals';
import { InputDirections } from './InputDirection';
import MathUtils from "loggie/utils/MathUtils";

enum Direction {
    None,
    Up,
    Down,
    Left,
    Right
}

export default class WasdInput extends GameObject implements InputDirections {
    onPointerDown: Signal = new Signal();
    onPointerUp: Signal = new Signal();

    public direction: PIXI.Point = new PIXI.Point();
    private rawDirection: PIXI.Point = new PIXI.Point();
    public angle: number = 0;

    private keysPressed: Array<Direction> = [];

    build(): void {
        super.build();
        document.addEventListener('keydown', (event: any) => {
            this.handleKeyDown(event);
        });

        document.addEventListener('keyup', (event: any) => {
            this.handleKeyUp(event);
        });


        window.addEventListener('blur', () => {
            this.rawDirection.x = 0;
            this.rawDirection.y = 0;
        });
    }
    getNormal(): number {
        return this.getPressed() ? 1 : 0;
    }
    getPressed(): boolean {
        return this.rawDirection.y != 0 || this.rawDirection.x != 0;
    }
    getDirections(): PIXI.Point {
        return this.direction;
    }
    update(delta:number, unscaledTime:number){
        super.update(delta, unscaledTime);
        this.rawDirection.x = this.findHorizontal()
        this.rawDirection.y = this.findVertical()
        this.angle = Math.atan2(this.rawDirection.y, this.rawDirection.x);
        this.direction.x = Math.cos(this.angle);
        this.direction.y = Math.sin(this.angle);
        MathUtils.normalizePoint(this.direction)
    }
    findHorizontal():number{
        for (let index = 0; index < this.keysPressed.length; index++) {
            const element = this.keysPressed[index];
            if(element == Direction.Left){
                return -1;
            }else if(element == Direction.Right){
                return 1;
            }
        }
        return 0;
    }
    findVertical():number{
        for (let index = 0; index < this.keysPressed.length; index++) {
            const element = this.keysPressed[index];
            if(element == Direction.Up){
                return -1;
            }else if(element == Direction.Down){
                return 1;
            }
        }
        return 0;
    }
    private handleKeyDown(event: KeyboardEvent) {
        const direction = this.getDirectionFromKeyCode(event.key);
        if (direction !== Direction.None) {
            if (!this.keysPressed.includes(direction)) {
                this.keysPressed.unshift(direction);
            }
        }
    }
    private handleKeyUp(event: KeyboardEvent) {
        const direction = this.getDirectionFromKeyCode(event.key);
        if (direction !== Direction.None) {
            if (this.keysPressed.includes(direction)) {
                this.keysPressed.splice(this.keysPressed.indexOf(direction), 1);
            }
        }
    }    
    private getDirectionFromKeyCode(keyCode: string): Direction {
        switch (keyCode) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                return Direction.Up;
            case 's':
            case 'S':
            case 'ArrowDown':
                return Direction.Down;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                return Direction.Left;
            case 'd':
            case 'D':
            case 'ArrowRight':
                return Direction.Right;
            default:
                return Direction.None;
        }
    }
   
}
