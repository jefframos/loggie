
import * as PIXI from "pixi.js";

import GameObject from '../gameObject/GameObject';
import { Signal } from 'signals';
import { InputDirections } from './InputDirection';
import MathUtils from "loggie/utils/MathUtils";

export default class WasdInput extends GameObject implements InputDirections {
    onPointerDown: Signal = new Signal();
    onPointerUp: Signal = new Signal();

    public direction: PIXI.Point = new PIXI.Point();
    private rawDirection: PIXI.Point = new PIXI.Point();
    public angle: number = 0;

    build(): void {
        super.build();
        // const cursors = this.scene.input.keyboard?.createCursorKeys();
        // const wasdKeys = this.scene.input.keyboard?.addKeys('W,A,S,D') as {
        //     W: Phaser.Input.Keyboard.Key;
        //     A: Phaser.Input.Keyboard.Key;
        //     S: Phaser.Input.Keyboard.Key;
        //     D: Phaser.Input.Keyboard.Key;
        // };

        document.addEventListener('keydown', (event: any) => {
            this.handleKeyPress(event.key);
        });

        document.addEventListener('keyup', (event: any) => {
            this.handleKeyRelease(event.key);
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
    handleKeyPress(key: string) {
        switch (key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.rawDirection.y = -1
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.rawDirection.x = -1
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                this.rawDirection.y = 1
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.rawDirection.x = 1;
                break;
            default:
                // this.rawDirection.x = 0;
                // this.rawDirection.y = 0;
                // this.direction.x = 0;
                // this.direction.y = 0;
        }
        
        if(this.getPressed()){
        }
        this.angle = Math.atan2(this.rawDirection.y, this.rawDirection.x);
        this.direction.x = Math.cos(this.angle);
        this.direction.y = Math.sin(this.angle);

        MathUtils.normalizePoint(this.direction)
    }

    handleKeyRelease(key: string) {
        switch (key) {
            case 'w':
            case 'W':
            case 's':
            case 'S':
            case 'ArrowUp':
            case 'ArrowDown':
                this.rawDirection.y = 0;
                break;
            case 'a':
            case 'A':
            case 'd':
            case 'D':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.rawDirection.x = 0;
                break;
            default:
                // this.rawDirection.x = 0;
                // this.rawDirection.y = 0;
                // this.direction.x = 0;
                // this.direction.y = 0;
        }


        this.angle = Math.atan2(this.rawDirection.y, this.rawDirection.x);
        if (Math.round(this.rawDirection.y) == 0 && Math.round(this.rawDirection.x) == 0) {
            this.direction.x = 0;
            this.direction.y = 0;
        } else {
            this.direction.x = Math.cos(this.angle);
            this.direction.y = Math.sin(this.angle);
        }

    }

    lateUpdate(delta: number, time: number): void {
        super.lateUpdate(delta, time);

    }
}
