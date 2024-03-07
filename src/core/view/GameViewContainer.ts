import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import GameView from './GameView';
export default class  GameViewContainer extends GameView {
    public _view: PIXI.Container = new PIXI.Container();
    constructor(gameObject: GameObject){
        super(gameObject)
    }
    
    addChild(element:PIXI.DisplayObject){
        this._view.addChild(element);
    }
}