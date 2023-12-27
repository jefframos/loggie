import * as PIXI from 'pixi.js';

import Game from '../../Game';
import GameObject from './gameObject/GameObject';
import Vector3 from './gameObject/Vector3';

export default class Camera extends GameObject {
    static _instance = null;
    static Zoom = 1;
    static ViewportSize = {
        width: 1000,
        height: 1000,
        min: 0,
        max: 1000
    }
    constructor() {
        super()
        this.targetZoom = Game.Debug.zoom || 0.75;
        this.followPoint = new Vector3();
    }
    update(delta) {
        super.update(delta);

        Camera.ViewportSize.width = Game.Borders.width / Camera.Zoom 
        Camera.ViewportSize.height = Game.Borders.height / Camera.Zoom 

        // Camera.ViewportSize.width = Game.Borders.width / (Camera.Zoom /Game.GlobalScale.x)
        // Camera.ViewportSize.height = Game.Borders.height / (Camera.Zoom / Game.GlobalScale.y)

        Camera.ViewportSize.min = Math.min(Game.Borders.width, Game.Borders.height)
        Camera.ViewportSize.max = Math.max(Game.Borders.width, Game.Borders.height)

    }
}