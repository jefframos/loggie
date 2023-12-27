import * as PIXI from 'pixi.js';

import Color from '../utils/Color';
import RenderModule from '../modules/RenderModule';
import TagManager from '../TagManager';

export default class GameView {
    constructor(gameObject) {
        this.tag = TagManager.Tags.Untagged;
        this.layer = RenderModule.RenderLayers.Gameplay
        this.viewOffset = { x: 0, y: 0 }
        this.view = null;
        this.gameObject = gameObject;
        this.anchorOffset = 0;
        this.baseScale = { x: 0, y: 0 }
        this.lightRange = 1;
        this.auxColor = 0xFFFFFF;
        this.auxColorRGB = Color.toRGB(this.auxColor)
    }
    get x() {
        return this.view.x
    }
    get y() {
        return this.view.y
    }
    update(delta) {
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
}