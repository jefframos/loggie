

import GameObject from '../gameObject/GameObject';
import { Signal } from 'signals';

export default class WasdInput extends GameObject implements InputDirections {
    onPointerDown: Signal = new Signal();
    onPointerUp: Signal = new Signal();

    public direction: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
    private rawDirection: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;
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

        this.scene.input.keyboard?.on('keydown', (event: any) => {
            this.handleKeyPress(event.key);
        });

        this.scene.input.keyboard?.on('keyup', (event: any) => {
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
    getDirections(): Phaser.Math.Vector2 {
        return this.direction.normalize();
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
        this.angle = this.rawDirection.angle();
        this.direction.x = Math.cos(this.angle);
        this.direction.y = Math.sin(this.angle);
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


        this.angle = this.rawDirection.angle();
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
