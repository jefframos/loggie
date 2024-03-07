import * as PIXI from 'pixi.js';

import Color from '../utils/Color';
import RenderModule from '../modules/RenderModule';
import { TagType } from '../TagType';
import GameObject from '../gameObject/GameObject';
import BaseComponent from '../gameObject/BaseComponent';
import Transform from '../gameObject/Transform';

export default class GameView extends BaseComponent {
    public layer: string;
    public viewOffset: PIXI.Point;
    public baseScale: PIXI.Point;
    public _view: PIXI.Container = new PIXI.Container();

    public get view(){
        return this._view
    }
    constructor(gameObject: GameObject) {
        super()
        this.setTag(TagType.Untagged);
        this.layer = RenderModule.RenderLayers.Gameplay
        this.viewOffset = new PIXI.Point()
        this.baseScale = new PIXI.Point(1)
        this.gameObject = gameObject;
    }
    get x() {
        return this.view.x
    }
    get y() {
        return this.view.y
    }
    get transform():Transform{
        return this.gameObject.transform;
    }
  
    update(delta:number) {
        super.update(delta);
    }
    onRender() {
        if (this.gameObject) {
            this.view.zIndex = this.gameObject.transform.position.z;
        }
    }
    applyScale() {
        this.baseScale.x = this.view.scale.x;
        this.baseScale.y = this.view.scale.y;
    }
    destroy(): void {
        super.destroy();
        this.view.children = [];
    }
}