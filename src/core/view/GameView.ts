import * as PIXI from 'pixi.js';

import Color from '../utils/Color';
import RenderModule from '../render/RenderModule';
import { TagType } from '../TagType';
import GameObject from '../gameObject/GameObject';
import BaseComponent from '../gameObject/BaseComponent';
import Transform from '../gameObject/Transform';
import { Signal } from 'signals';
import { RenderLayers } from '../render/RenderLayers';

export default class GameView extends BaseComponent {
    private _layer: string = RenderLayers.Gameplay;
    public viewOffset: PIXI.Point;
    public baseScale: PIXI.Point;
    public pixelPerfect: boolean = false;
    public _view: PIXI.Container = new PIXI.Container();
    public onSwapLayer: Signal = new Signal();
    public get view() {
        return this._view
    }
    public set layer(value: string) {
        if(this._layer != value){
            this.onSwapLayer.dispatch(this, value);
        }
        this._layer = value;
    }
    public get layer() {
        return this._layer;
    }
    constructor(gameObject: GameObject) {
        super()
        this.setTag(TagType.Untagged);
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
    get transform(): Transform {
        return this.gameObject.transform;
    }

    update(delta: number, unscaledDelta: number) {
        super.update(delta, unscaledDelta);

        if (this.pixelPerfect) {
            this.view.x = Math.round(this.transform.position.x)
            this.view.y = Math.round(this.transform.position.z + this.transform.position.y)
        } else {
            this.view.x = this.transform.position.x
            this.view.y = this.transform.position.z + this.transform.position.y
        }
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