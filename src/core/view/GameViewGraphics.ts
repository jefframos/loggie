import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import GameView from './GameView';
export default class  GameViewGraphics extends GameView {
    public graphic: PIXI.Graphics = new PIXI.Graphics();
    constructor(gameObject: GameObject){
        super(gameObject)
    }
    public get view(){
        return this.graphic
    }
    addChild(element:PIXI.DisplayObject){
        this.graphic.addChild(element);
    }
}