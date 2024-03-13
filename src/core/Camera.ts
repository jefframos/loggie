import * as PIXI from 'pixi.js';

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
    protected targetZoom: number = 1;
    protected targetPivot: PIXI.Point = new PIXI.Point();
    protected followPoint: Vector3 = new Vector3();
    constructor() {
        super()
        this.targetZoom = 1// Game.Debug.zoom || 0.75;
        this.followPoint = new Vector3();
    }
    setFollowPoint(followPoint: Vector3) {
        this.followPoint = followPoint;
    }
    setZoom(targetZoom: number = 1) {
        this.targetZoom = targetZoom;
    }
    update(delta: number, unscaledTime: number) {
        super.update(delta, unscaledTime);

        // Camera.ViewportSize.width = Game.Borders.width / Camera.Zoom 
        // Camera.ViewportSize.height = Game.Borders.height / Camera.Zoom 

        // // Camera.ViewportSize.width = Game.Borders.width / (Camera.Zoom /Game.GlobalScale.x)
        // // Camera.ViewportSize.height = Game.Borders.height / (Camera.Zoom / Game.GlobalScale.y)

        // Camera.ViewportSize.min = Math.min(Game.Borders.width, Game.Borders.height)
        // Camera.ViewportSize.max = Math.max(Game.Borders.width, Game.Borders.height)

    }
}