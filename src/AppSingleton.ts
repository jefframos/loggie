import * as PIXI from 'pixi.js';
import { Signal } from 'signals';
export default class AppSingleton {
    static app: PIXI.Application<HTMLCanvasElement>;
    static globalPointer: PIXI.Point = new PIXI.Point();
    static onPointerDown:Signal = new Signal();
    static onPointerUp:Signal = new Signal();
    static initialize() {
        window.addEventListener('pointermove', (event) => {
            const { x, y } = event;
            AppSingleton.globalPointer.x = x;
            AppSingleton.globalPointer.y = y;
        });

        window.addEventListener('pointerdown', (event) => {
            AppSingleton.onPointerDown.dispatch(event)
        });

        window.addEventListener('pointerup', (event) => {
            AppSingleton.onPointerUp.dispatch(event)
        });
    }
}