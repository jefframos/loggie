import * as PIXI from 'pixi.js';

export interface InputDirections {
    getDirections(): PIXI.Point;
    getNormal():number;
    getPressed():boolean;
}