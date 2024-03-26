import * as PIXI from 'pixi.js';
import Loggie from 'loggie/core/Loggie';
import GameObject from 'loggie/core/gameObject/GameObject';
import GameView from './GameView';
export default class  GameViewTiledSprite extends GameView {
    public sprite: PIXI.TilingSprite = new PIXI.TilingSprite(PIXI.Texture.EMPTY);
    constructor(gameObject: GameObject){
        super(gameObject)
    }
    public get view(){
        return this.sprite
    }
    addChild(element:PIXI.DisplayObject){
        this.sprite.addChild(element);
    }
    destroy(): void {
        super.destroy();
    }
}